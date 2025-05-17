let metadata;

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("metadata.json");
  metadata = await res.json();

  const mainTopics = metadata.map(item => item.main_topic);
  const topicContainer = document.getElementById("topics");

  mainTopics.forEach(topic => {
    const btn = document.createElement("button");
    btn.innerText = topic;
    btn.addEventListener("click", () => showCards(topic));
    topicContainer.appendChild(btn);
  });
});

async function showCards(topic) {
  const cardsContainer = document.getElementById("cards");
  cardsContainer.innerHTML = "";

  // Find the description file for the main topic
  const topicInfo = metadata.find(item => item.main_topic === topic);
  if (!topicInfo) return;

  // Fetch the entire text file for the main topic
  const txtRes = await fetch(topicInfo.description_file);
  const text = await txtRes.text();

  // Split by separator line to get each subtopic block
  const blocks = text.split(/[-]{30,}/).map(b => b.trim()).filter(b => b.length > 0);

  blocks.forEach(block => {
    // Extract Topic name, Date, and Description using regex
    const topicNameMatch = block.match(/Topic name:\s*(.+)/i);
    const dateMatch = block.match(/Date:\s*(.+)/i);
    const descriptionMatch = block.match(/Description:\s*([\s\S]+)/i);

    if (!topicNameMatch || !dateMatch || !descriptionMatch) return;

    const subTopicName = topicNameMatch[1].trim();
    const date = dateMatch[1].trim();

    // Optionally, you can format or limit the description preview here
    const description = descriptionMatch[1].trim();

    // Build URL parameters with main_topic, subtopic, and file path for details page
    const params = new URLSearchParams({
      topic: topic,
      subtopic: subTopicName,
      file: topicInfo.description_file
    });

    const card = document.createElement("div");
    card.className = "ag-courses_item";

    card.innerHTML = `
      <a href="details.html?${params.toString()}" target="_blank" class="ag-courses-item_link">
        <div class="ag-courses-item_bg"></div>
        <div class="ag-courses-item_title">${subTopicName}</div>
        <div class="ag-courses-item_date-box">Date: <span class="ag-courses-item_date">${date}</span></div>
      </a>
    `;

    cardsContainer.appendChild(card);
  });
}
