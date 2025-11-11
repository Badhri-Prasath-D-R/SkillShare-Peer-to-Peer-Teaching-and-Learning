export class User {
  static async me() {
    return {
      email: "test@example.com",
      full_name: "Test User",
      points: 15,
      sessions_hosted: 2,
      sessions_attended: 5,
      average_rating: 4.2,
      skills_known: ["JavaScript", "React"],
      skills_wanted: ["Node.js", "TypeScript"],
      bio: "I am a software developer"
    };
  }

  static async updateMyUserData(updates) {
    console.log("Updating user with:", updates);
    return { success: true };
  }
}