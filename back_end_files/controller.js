import pool from "./config.js"

const getData = async (req, res, next) => {
    console.log('getData called')
    try {
        //single combined query
        const data = await pool.query(
            //For right now, pull all data to feed to state and not worry about users yet
            //want to be able to filter by user and maybe only grab the week data and grab the day and set contents as needed
            ` SELECT
                W.week_id,
                W.week_number,
                W.page_number,
                D.day_id,
                D.day_number,
                D.is_day_complete,
                E.exercise_id,
                E.exercise_tier,
                E.exercise_name,
                E.exercise_set_count,
                E.target_weight,
                E.target_reps,
                E.can_add_sets,
                SR.set_id,
                SR.set_number,
                SR.actual_weight,
                SR.actual_reps,
                SR.is_set_complete
            FROM week W
                LEFT JOIN day D ON W.week_id = D.week_id
                LEFT JOIN exercise E ON D.day_id = E.day_id
                LEFT JOIN set_result SR ON E.exercise_id = SR.exercise_id
        `);
        if (data.rowCount == 0)
            return res.status(404).send("No week data exists");
        console.log('data: ', data)
        const reducedData = data.rows.reduce((acc, row) => {

            let week = acc.find(w => w.id === row.week_id);
            if (!week) {
                week = { id: row.week_id, week: row.week_number, page: row.page_number, data: [] };
                acc.push(week);
            }

            let data = week.data.find(d => d.id === row.day_id);
            if (!data) {
                data = { id: row.day_id, day: row.day_number, isDayComplete: row.is_day_complete, exercises: [] };
                week.data.push(data);
            }

            let exercise = data.exercises.find(e => e.id === row.exercise_id);
            if (!exercise) {
                exercise = {
                    id: row.exercise_id,
                    tier: row.exercise_tier,
                    name: row.exercise_name,
                    sets: row.exercise_set_count,
                    targetWeight: row.target_weight,
                    targetReps: row.target_reps,
                    addSets: row.can_add_sets,
                    setResults: []
                };
                data.exercises.push(exercise);
            }

            exercise.setResults.push({
                id: row.set_id,
                setNumber: row.set_number,
                actReps: row.actual_reps,
                actWeight: row.actual_weight,
                isSetComplete: row.is_set_complete,
            });

            return acc;
        }, []);
        //console.log('reduced data: ', JSON.stringify(reducedData, null, 2));

        return res.status(200).json({
            status: 200,
            message: "All lift data:",
            data: reducedData
        });

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return next(error);
    }
};

const createData = async (req, res, next) => {
    console.log('postData called')
    //console.log('req.body: ', req.body)

    const weekArray = req.body

    try {
        // Start transaction
        await pool.query('BEGIN');
        // 1. Insert Week
        for (const week of weekArray) {
            console.log('week: ', week)
            const weekQuery = `
            INSERT INTO week (week_number, week_id, page_number)
            VALUES ($1, $2, $3)
            ON CONFLICT (week_id) DO UPDATE SET week_number = EXCLUDED.week_number, page_number = EXCLUDED.page_number
            RETURNING week_id`;
            const weekResult = await pool.query(weekQuery, [week.week, week.id, week.page]);
            const weekId = await weekResult.rows[0].week_id;

            // 2. Insert Days
            for (const day of week.data) {
                const dayQuery = `
                INSERT INTO day (day_id, week_id, day_number, is_day_complete)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (day_id) DO UPDATE SET day_number = EXCLUDED.day_number, is_day_complete = EXCLUDED.is_day_complete
                RETURNING day_id`;
                const dayResult = await pool.query(dayQuery, [day.id, weekId, day.day, day.isDayComplete]);
                const dayId = await dayResult.rows[0].day_id;

                // 3. Insert Exercises
                for (const exercise of day.exercises) {
                    const exerciseQuery = `
                    INSERT INTO exercise (exercise_id, day_id, exercise_tier, exercise_name, 
                        exercise_set_count, target_weight, target_reps, can_add_sets)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    ON CONFLICT (exercise_id) DO UPDATE SET 
                        exercise_tier = EXCLUDED.exercise_tier, 
                        exercise_name = EXCLUDED.exercise_name, 
                        exercise_set_count = EXCLUDED.exercise_set_count,                         
                        target_weight = EXCLUDED.target_weight, 
                        target_reps = EXCLUDED.target_reps, 
                        can_add_sets = EXCLUDED.can_add_sets
                    RETURNING exercise_id`;
                    const exerciseResult = await pool.query(exerciseQuery, [
                        exercise.id,
                        dayId,
                        exercise.tier,
                        exercise.name,
                        exercise.sets,
                        exercise.targetWeight,
                        exercise.targetReps,
                        exercise.addSets
                    ]);
                    const exerciseId = await exerciseResult.rows[0].exercise_id;

                    // 4. Insert Set Results
                    for (const set of exercise.setResults) {
                        const setQuery = `
                        INSERT INTO set_result (set_id, exercise_id, set_number, 
                            actual_weight, actual_reps, is_set_complete)
                        VALUES ($1, $2, $3, $4, $5, $6)
                        ON CONFLICT (set_id) DO UPDATE SET 
                            set_number = EXCLUDED.set_number, 
                            actual_weight = EXCLUDED.actual_weight, 
                            actual_reps = EXCLUDED.actual_reps, 
                            is_set_complete = EXCLUDED.is_set_complete`;
                        await pool.query(setQuery, [
                            set.id,
                            exerciseId,
                            set.setNumber,
                            set.actWeight,
                            set.actReps,
                            set.isSetComplete
                        ]);
                    }
                }
            }
        }
        // Commit transaction
        await pool.query('COMMIT');

        return res.status(201).json({
            status: 201,
            message: "Week data created successfully"
        });

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error creating week data:', error);
        return res.status(500).json({ error: 'Failed to create week data' });
    }
};

export {
    getData,
    createData
}

//other sample CRUD functions
//                 const updateArticle = async (req, res, next) => {
//                     const id = parseInt(req.params.id);
//                     const { title, article } = req.body;

//                     const query =
//                         "UPDATE article SET title=$1, article=$2 WHERE id=$3 RETURNING *;";
//                     const value = [title, article, id];

//                     try {
//                         const data = await pool.query(query, value);

//                         if (data.rowCount == 0) return res.status(404).send("Article does not exist");

//                         return res.status(200).json({
//                             status: 200,
//                             message: "Article updated successfully ",
//                             data: data.rows
//                         })
//                     } catch (error) {
//                         return next(error);
//                     }
//                 };

//                 const deleteArticle = async (req, res, next) => {
//                     const id = parseInt(req.params.id);
//                     const value = [id];
//                     const query = "DELETE FROM article WHERE id=$1;";

//                     try {
//                         const data = await pool.query(query, value);

//                         if (data.rowCount == 0) return res.status(404).send("Article does not exist");

//                         return res.status(200).json({
//                             status: 200,
//                             message: "Article deleted successfully"
//                         })
//                     } catch (error) {
//                         return next(error);
//                     }
//                 };

//                 export {
//                     getData,
//                     createData,
//                     getDataById,
//                     updateData,
//                     deleteData
//                 };