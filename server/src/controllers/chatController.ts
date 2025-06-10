import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import pool from "../config/db";
import {
  ChatRequest,
  Routine,
  Event,
  ExamRoutine,
  Player,
  Fixture,
  NewsArticle,
} from "../interfaces/types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const apiFootballKey = process.env.API_FOOTBALL_KEY || "";

const apiFootball = axios.create({
  baseURL: "https://v3.football.api-sports.io/",
  headers: {
    "x-rapidapi-key": apiFootballKey,
  },
});

export const handleChat = async (
  req: Request<{}, {}, ChatRequest>,
  res: Response
) => {
  const { message, username } = req.body;

  try {
    let response =
      "Sorry, I didn’t understand that. Try asking about Man City news, players, or fixtures!";
    let query: string | undefined;
    let params: any[] = [];
    let dataFound = false;

    const lowerMessage = message.toLowerCase().trim();

    // Man City-related queries
    if (
      lowerMessage.includes("man city players") ||
      lowerMessage.includes("man city squad")
    ) {
      const playersResponse = await apiFootball.get("players/squads", {
        params: { team: "50" },
      });
      const players: Player[] = playersResponse.data.response[0].players;

      if (players.length > 0) {
        dataFound = true;
        response = "Here are the Man City players:\n";
        players.forEach((player: Player) => {
          response += `${player.name} - ${player.position}\n`;
        });
      }
    } else if (
      lowerMessage.includes("man city fixtures") ||
      lowerMessage.includes("man city schedule")
    ) {
      const fixturesResponse = await apiFootball.get("fixtures", {
        params: { team: "50", next: "5" },
      });
      const fixtures: Fixture[] = fixturesResponse.data.response;

      if (fixtures.length > 0) {
        dataFound = true;
        response = "Here are the next 5 Man City fixtures:\n";
        fixtures.forEach((fixture: Fixture) => {
          response += `${fixture.teams.home.name} vs ${fixture.teams.away.name} on ${fixture.fixture.date}\n`;
        });
      }
    } else if (
      lowerMessage.includes("man city news") ||
      lowerMessage.includes("man city latest")
    ) {
      const newsResponse = await apiFootball.get("news", {
        params: { team: "50" },
      });
      const news: NewsArticle[] = newsResponse.data.response;

      if (news.length > 0) {
        dataFound = true;
        response = "Here are the latest Man City news:\n";
        news.forEach((article: NewsArticle) => {
          response += `${article.title} - ${article.content}\n`;
        });
      }
    }

    // Exam-related queries
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
      const exams: ExamRoutine[] = rows as ExamRoutine[];

      if (exams.length > 0) {
        dataFound = true;
        response = "📚 Your exam routine:\n";
        exams.forEach((row: ExamRoutine) => {
          const examDate = new Date(row.exam_date).toLocaleDateString(
            undefined,
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          );
          const startTime = row.start_time.slice(0, 5);
          const endTime = row.end_time.slice(0, 5);
          response += `${row.exam_name} - ${row.subject} on ${examDate} from ${startTime} to ${endTime} in room ${row.room_no} (Invigilator: ${row.invigilator})\n`;
        });
      }
    }
    // Schedule/routine queries
    else if (
      lowerMessage.includes("schedule") ||
      lowerMessage.includes("routine")
    ) {
      query = `
        SELECT r.day, r.subject, r.start_time, r.end_time, r.room, r.instructor 
        FROM routines r 
        JOIN users u ON r.semester = u.semester 
        WHERE u.username = ? 
        ORDER BY FIELD(r.day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), r.start_time
      `;
      params = [username];

      const [rows] = await pool.execute<RowDataPacket[]>(query, params);
      const routines: Routine[] = rows as Routine[];

      if (routines.length > 0) {
        dataFound = true;
        response = "Here’s your schedule:\n";
        routines.forEach((row: Routine) => {
          response += `${row.day}: ${row.subject} from ${row.start_time} to ${row.end_time} in ${row.room} with ${row.instructor}\n`;
        });
      }
    }
    // Events queries
    else if (
      lowerMessage.includes("event") ||
      lowerMessage.includes("events")
    ) {
      query = `SELECT event_name, event_date, location, description FROM events ORDER BY event_date`;

      const [rows] = await pool.execute<RowDataPacket[]>(query);
      const events: Event[] = rows as Event[];

      if (events.length > 0) {
        dataFound = true;
        response = "Upcoming events:\n";
        events.forEach((row: Event) => {
          const eventDate = new Date(row.event_date).toLocaleDateString(
            undefined,
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          );
          response += `${row.event_name} on ${eventDate} at ${row.location}: ${row.description}\n`;
        });
      }
    }

    // If no data found, call Gemini API
    if (!dataFound) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API key is not configured.");
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are a helpful chatbot for Manchester City Football Club. The user asked: "${message}". Since no specific match, player, or event data was found in the database, provide a general response to the user's query. Keep the response concise, friendly, and relevant to Manchester City or football.`;

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
