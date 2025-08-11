import { sendMail } from '../../utils/mailer';
import { inngest } from '../client';
import UserModel from '../../models/User';
import { NonRetriableError } from 'inngest';

export const onUserSignUp = inngest.createFunction(
  { id: 'user-signup-email' },
  { event: 'user/signup' },
  async ({ event, step }) => {
    try {
      const { email } = event.data;

      const user = await step.run({ id: 'get-user-email' }, async () => {
        const userObject = await UserModel.findOne({ email });
        if (!userObject) {
          throw new NonRetriableError("User no longer exists in our database.");
        }
        return userObject;
      });

      await step.run({ id: 'send-signup-email' }, async () => {
        return await sendMail(
          user.email,
          "Welcome to Inngest Smart Ticket Tracker",
          `Hi,
          \n\n
          Thank you for signing up on Smart Ticket Tracker.
          \n\n
          We are glad to have you onboard! 
          `
        );
      });

      return { success: true };
    } catch (err) {
      console.error("❌ Error running step", err.message);
      return { success: false };
    }
  }
)