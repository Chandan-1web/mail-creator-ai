async function testMailApi() {
  try {
    const res = await fetch("http://localhost:5000/api/mails", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtcTVnMWZxcDAwMDAxNGp5YXpvb3UwcTciLCJlbWFpbCI6InRlc3QyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3ODA5MzcyMjIsImV4cCI6MTc4MTU0MjAyMn0.nO50TOZl7gEgDlrXmpSbv77RaMME9ESob873TAFzdNE"
      },
      body: JSON.stringify({
        subject: "Meeting Reminder",
        recipientName: "Bob",
        recipientRole: "Manager",
        senderRole: "Employee",
        tone: "formal",
        keyPoints: "Meeting at 3PM"
      })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
testMailApi();
