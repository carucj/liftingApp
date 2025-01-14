// import { render, screen, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import WorkoutForm from './WorkoutForm';


//form should intake only valid numbers for each value, must be greater than 0
//form should submit data to the onSubmit function on button press

// describe('WorkoutForm', () => {
//     test('submits workout data correctly', async () => {
//         const onSubmit = vi.fn();
//         render(<WorkoutForm onSubmit={onSubmit} />);

//         await userEvent.type(screen.getByLabelText(/exercise name/i), 'Squats');
//         await userEvent.type(screen.getByLabelText(/weight/i), '225');
//         await userEvent.type(screen.getByLabelText(/reps/i), '5');
//         await userEvent.click(screen.getByRole('button', { name: /save/i }));

//         await waitFor(() => {
//             expect(onSubmit).toHaveBeenCalledWith({
//                 name: 'Squats',
//                 weight: 225,
//                 reps: 5,
//             });
//         });
//     });
// });


// Remember to:

// Write tests as you develop new features
// Focus on testing user behavior rather than implementation details
// Maintain a good test coverage
// Use meaningful test descriptions
// Group related tests using describe blocks