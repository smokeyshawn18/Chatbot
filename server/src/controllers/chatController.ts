import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import pool from "../config/db";
import { ChatRequest, Routine, Event, ExamRoutine } from "../interfaces/types";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const handleChat = async (
  req: Request<{}, {}, ChatRequest>,
  res: Response
) => {
  const { message, username } = req.body;

  try {
    let response =
      "Sorry, I didn’t understand that. Try asking about your schedule, exam routine, or upcoming events!";
    let query: string | undefined;
    let params: any[] = [];
    let dataFound = false; // Flag to track if database data was found

    const lowerMessage = message.toLowerCase().trim();

    // Check for exam-related queries
    if (
      lowerMessage.includes("exam") ||
      lowerMessage.includes("exam routine") ||
      lowerMessage.includes("exam schedule") ||
      lowerMessage.includes("exam timetable") ||
      lowerMessage.includes("exam dates") ||
      lowerMessage.includes("upcoming exams") ||
      lowerMessage.includes("bsc csit")
    ) {
      query = `
        SELECT e.exam_name, e.subject, e.exam_date, e.start_time, e.end_time, e.room_no, e.invigilator
        FROM exam_routine e
        JOIN users u ON e.semester = u.semester
        WHERE u.username = ?
        ORDER BY e.exam_date, e.start_time
      `;
      params = [username];

      const [rows] = await pool.execute<RowDataPacket[]>(query, params);
      const exams = rows as ExamRoutine[];

      if (exams.length > 0) {
        dataFound = true;
        response = "📚 Your exam routine:\n";
        exams.forEach((row) => {
          const examDate = new Date(row.exam_date).toLocaleDateString();
          const startTime = row.start_time.slice(0, 5);
          const endTime = row.end_time.slice(0, 5);
          response += `${row.exam_name} - ${row.subject} on ${examDate} from ${startTime} to ${endTime} in room ${row.room_no} (Invigilator: ${row.invigilator})\n`;
        });
      }
    }

    // Check for regular schedules/routines
    else if (
      lowerMessage.includes("schedule") ||
      lowerMessage.includes("routine")
    ) {
      query = `
        SELECT r.day, r.subject, r.start_time, r.end_time, r.room, r.instructor 
        FROM routines r 
        JOIN users u ON r.semester = u.semester 
        WHERE u.username = ? 
        ORDER BY r.day, r.start_time
      `;
      params = [username];

      const [rows] = await pool.execute<RowDataPacket[]>(query, params);
      const routines = rows as Routine[];

      if (routines.length > 0) {
        dataFound = true;
        response = "Here’s your schedule:\n";
        routines.forEach((row) => {
          response += `${row.day}: ${row.subject} from ${row.start_time} to ${row.end_time} in ${row.room} with ${row.instructor}\n`;
        });
      }
    }

    // Check for events
    else if (
      lowerMessage.includes("event") ||
      lowerMessage.includes("events")
    ) {
      query = `SELECT event_name, event_date, location, description FROM events ORDER BY event_date`;

      const [rows] = await pool.execute<RowDataPacket[]>(query);
      const events = rows as Event[];

      if (events.length > 0) {
        dataFound = true;
        response = "Upcoming events:\n";
        events.forEach((row) => {
          response += `${row.event_name} on ${new Date(
            row.event_date
          ).toLocaleDateString()} at ${row.location}: ${row.description}\n`;
        });
      }
    }

    // If no data found in the database, query Gemini API
    if (!dataFound) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API key is not configured.");
      }

      // Initialize the Gemini model (e.g., gemini-1.5-flash)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Prepare the prompt for Gemini
      const prompt = `You are a helpful chatbot for a university. The user asked: "${message}". 
      Since no specific schedule, exam, or event data was found in the database, provide a general response to the user's query. 
      Keep the response concise, friendly, and relevant to a university context.`;

      // Generate content using Gemini API
      const result = await model.generateContent(prompt);
      const geminiResponse = await result.response.text();

      response =
        geminiResponse || "I couldn't generate a response. Please try again!";
    }

    res.json({ reply: response });
  } catch (error) {
    console.error("Error in handleChat:", error);
    res.status(500).json({ reply: "Oops! Something went wrong." });
  }
};
