import { createAgent, gemini } from '@inngest/agent-kit';

export const getAIResponse = async (ticket) => {
  const ticketManagerAgent = createAgent({
    name: "Smart Ticket Triage Manager",
    description: "Provides expert support in managing tickets",
    system: `Your are a experienced and super helpful ticket triage manager who manages tickets created by analyzing them based on below points:
      Title,
      Description

      After analyzing you create a small report about ticket in below format:
        HelpFulNotes: this will hold important notes from your analysis,
        Related skills: this will hold array of skills required to work on a issue/problem/request mentioned in ticket based on your analysis,
        Priority: how important it is to quickly address this ticket, it must hold values among High, Medium, Low
      
      Return this output in JSON format as per example given below, don't add any bullet points, string template literals.
      e.g { helpfulNotes: "", relatedSkills: ["React", "SpringBoot"], priority: "High" }
    `,
    model: gemini({
      model: "gemini-1.5-flash-8b",
      apiKey: process.env.GEMINI_API_KEY,
    }),
  });

  const aiResponse = await ticketManagerAgent.run(`
    Analyze the ticket with your expertise and provide your analysis response strictly in JSON format as per example below:
    e.g. { helpfulNotes: "", relatedSkills: ["React", "Spring", "Java"], priority: "High" }

    Importantly note that the output should be strictly in JSON format only.

    ------------------
    
    Ticket Information:
    Title: ${ticket.title},
    Description: ${ticket.description}
  `);

  try {
    const rawData = aiResponse.output[0].content;
    console.log('Entire Response: ', aiResponse);

    return rawData;
  } catch (error) {
    console.error("❌ Error generating AI response");
    return null;
  }
};
