import { sendMail } from '../../utils/mailer.js';
import { inngest } from '../client.js';
import UserModel from '../../models/User.js';
import { NonRetriableError } from 'inngest';

export const onUserSignUp = inngest.createFunction(
  { id: 'user-signup-email' },
  { event: 'user/signup' },
  async ({ event, step }) => {
    try {
      const { email } = event.data;

      const user = await step.run(
        { id: 'Get user from provided email' },
        async () => {
          const userObject = await UserModel.findOne({ email }).select("email role skills");
          if (!userObject) {
            throw new NonRetriableError("User no longer exists in our database.");
          }
          return userObject;
        });

      const sentMailInfo = await step.run({ id: 'Send welcome email' }, async () => {
        return sendMail(
          "nikhilpatravale2373@gmail.com",
          "Welcome to Inngest Smart Ticket Tracker",
          `Hi User,\n\nThank you for signing up on Smart Ticket Tracker application.\n\nWe are glad to have you onboard!`
        );
      });

      console.log(`\n✅ Sign up email sent successfully.\n${JSON.stringify(sentMailInfo)}\n`)

      return { success: true };
    } catch (err) {
      console.error("❌ Error running step on user Signup", err.message);
      return { success: false };
    }
  }
)