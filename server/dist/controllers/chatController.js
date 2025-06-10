"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChat = void 0;
const db_1 = __importDefault(require("../config/db"));
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const handleChat = async (req, res) => {
    const { message, username } = req.body;
    try {
        let response = "Sorry, I didn’t understand that. Try asking about your schedule, exam routine, or upcoming events!";
        let query;
        let params = [];
        let dataFound = false;
        const lowerMessage = message.toLowerCase().trim();
        if (lowerMessage.includes("man city players") ||
            lowerMessage.includes("man city squad")) {
            query = `
        SELECT name, position, nationality, goals, assists, appearances
        FROM man_city_players
        ORDER BY goals DESC
      `;
            const [rows] = await db_1.default.execute(query);
            const players = rows;
            if (players.length > 0) {
                dataFound = true;
                response = "Here are the Man City players stats:\n";
                players.forEach((player) => {
                    response += `${player.name} - ${player.position} (${player.nationality}) | Goals: ${player.goals}, Assists: ${player.assists}, Appearances: ${player.appearances}\n`;
                });
            }
        }
        // Exam-related queries
        if (lowerMessage.includes("exam") ||
            lowerMessage.includes("exam routine") ||
            lowerMessage.includes("exam schedule") ||
            lowerMessage.includes("exam timetable") ||
            lowerMessage.includes("exam dates") ||
            lowerMessage.includes("upcoming exams") ||
            lowerMessage.includes("bsc csit")) {
            query = `
        SELECT e.exam_name, e.subject, e.exam_date, e.start_time, e.end_time, e.room_no, e.invigilator
        FROM exam_routine e
        JOIN users u ON e.semester = u.semester
        WHERE u.username = ?
        ORDER BY e.exam_date, e.start_time
      `;
            params = [username];
            const [rows] = await db_1.default.execute(query, params);
            const exams = rows;
            if (exams.length > 0) {
                dataFound = true;
                response = "📚 Your exam routine:\n";
                exams.forEach((row) => {
                    // Use toLocaleDateString with options if you want
                    const examDate = new Date(row.exam_date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    });
                    const startTime = row.start_time.slice(0, 5);
                    const endTime = row.end_time.slice(0, 5);
                    response += `${row.exam_name} - ${row.subject} on ${examDate} from ${startTime} to ${endTime} in room ${row.room_no} (Invigilator: ${row.invigilator})\n`;
                });
            }
        }
        // Schedule/routine queries
        else if (lowerMessage.includes("schedule") ||
            lowerMessage.includes("routine")) {
            query = `
        SELECT r.day, r.subject, r.start_time, r.end_time, r.room, r.instructor 
        FROM routines r 
        JOIN users u ON r.semester = u.semester 
        WHERE u.username = ? 
        ORDER BY FIELD(r.day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), r.start_time
      `;
            params = [username];
            const [rows] = await db_1.default.execute(query, params);
            const routines = rows;
            if (routines.length > 0) {
                dataFound = true;
                response = "Here’s your schedule:\n";
                routines.forEach((row) => {
                    response += `${row.day}: ${row.subject} from ${row.start_time} to ${row.end_time} in ${row.room} with ${row.instructor}\n`;
                });
            }
        }
        // Events queries
        else if (lowerMessage.includes("event") ||
            lowerMessage.includes("events")) {
            query = `SELECT event_name, event_date, location, description FROM events ORDER BY event_date`;
            const [rows] = await db_1.default.execute(query);
            const events = rows;
            if (events.length > 0) {
                dataFound = true;
                response = "Upcoming events:\n";
                events.forEach((row) => {
                    const eventDate = new Date(row.event_date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    });
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
            const prompt = `You are a helpful chatbot for a university. The user asked: "${message}". 
      Since no specific schedule, exam, or event data was found in the database, provide a general response to the user's query. 
      Keep the response concise, friendly, and relevant to a university context.`;
            const result = await model.generateContent(prompt);
            const geminiResponse = await result.response.text();
            response =
                geminiResponse || "I couldn't generate a response. Please try again!";
        }
        res.json({ reply: response });
    }
    catch (error) {
        console.error("Error in handleChat:", error);
        res.status(500).json({ reply: "Oops! Something went wrong." });
    }
};
exports.handleChat = handleChat;
