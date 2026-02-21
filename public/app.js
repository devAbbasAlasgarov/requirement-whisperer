(function () {
  const rawInput = document.getElementById("raw-input");
  const clarifyBtn = document.getElementById("clarify-btn");
  const statusEl = document.getElementById("status");
  const outputSection = document.getElementById("output-section");
  const userStoryEl = document.getElementById("user-story");
  const acceptanceList = document.getElementById("acceptance-criteria");
  const ambiguitiesBlock = document.getElementById("ambiguities-block");
  const ambiguitiesList = document.getElementById("ambiguities");

  const API_BASE = "";

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = "status" + (type ? " " + type : "");
  }

  function showOutput(data) {
    userStoryEl.textContent = data.userStory || "—";

    acceptanceList.innerHTML = "";
    (data.acceptanceCriteria || []).forEach(function (criterion) {
      const li = document.createElement("li");
      li.textContent = typeof criterion === "string" ? criterion : (criterion.text || JSON.stringify(criterion));
      acceptanceList.appendChild(li);
    });

    const ambiguities = data.ambiguities || [];
    if (ambiguities.length > 0) {
      ambiguitiesBlock.classList.remove("empty");
      ambiguitiesList.innerHTML = "";
      ambiguities.forEach(function (item) {
        const li = document.createElement("li");
        li.textContent = typeof item === "string" ? item : (item.text || JSON.stringify(item));
        ambiguitiesList.appendChild(li);
      });
    } else {
      ambiguitiesBlock.classList.add("empty");
      ambiguitiesList.innerHTML = "";
    }

    outputSection.classList.remove("hidden");
    outputSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  clarifyBtn.addEventListener("click", async function () {
    const text = (rawInput.value || "").trim();
    if (!text) {
      setStatus("Paste some requirement text first.", "error");
      return;
    }

    clarifyBtn.disabled = true;
    setStatus("Clarifying…", "loading");

    try {
      const res = await fetch(API_BASE + "/clarify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text })
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || "Something went wrong.", "error");
        return;
      }

      setStatus("Done.");
      showOutput(data);
    } catch (err) {
      setStatus("Network error. Is the server running on port 3000?", "error");
      console.error(err);
    } finally {
      clarifyBtn.disabled = false;
    }
  });
})();
