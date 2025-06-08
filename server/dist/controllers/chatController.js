"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const database_1 = __importDefault(require("../config/database"));
class ChatController {
    async handleChat(req, res) {
        const { message, username } = req.body;
        try {
            let response;
            if (this.isScheduleQuery(message)) {
                response = await this.handleScheduleQuery(username);
            }
            else if (this.isEventQuery(message)) {
                response = await this.handleEventQuery();
            }
            else {
                response =
                    "Sorry, I didn’t understand that. Try asking about your schedule or upcoming events!";
            }
            res.json({ reply: response });
        }
        catch (error) {
            console.error("Error processing query:", error);
            res
                .status(500)
                .json({ reply: "An error occurred while processing your request." });
        }
    }
    isScheduleQuery(message) {
        return /schedule|routine/i.test(message);
    }
    isEventQuery(message) {
        return /events?/i.test(message);
    }
    async handleScheduleQuery(username) {
        const query = `
      SELECT r.day, r.subject, r.start_time, r.end_time, r.room, r.instructor 
      FROM routines r 
      JOIN users u ON r.semester = u.semester 
      WHERE u.username = ? 
      ORDER BY r.day, r.start_time
    `;
        const [rows] = await database_1.default.execute(query, [username]);
        const routines = rows;
        if (routines.length === 0)
            return "No schedule found for your semester.";
        return routines.reduce((acc, row) => {
            return (acc +
                `${row.day}: ${row.subject} from ${row.start_time} to ${row.end_time} in ${row.room} with ${row.instructor}\n`);
        }, "Here’s your schedule:\n");
    }
    async handleEventQuery() {
        const query = `
      SELECT event_name, event_date, location, description 
      FROM events 
      ORDER BY event_date
    `;
        const [rows] = await database_1.default.execute(query);
        const events = rows;
        if (events.length === 0)
            return "No upcoming events found.";
        return events.reduce((acc, row) => {
            return (acc +
                `${row.event_name} on ${row.event_date} at ${row.location}: ${row.description}\n`);
        }, "Upcoming events:\n");
    }
}
exports.ChatController = ChatController;
