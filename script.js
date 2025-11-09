// Font Library with Modal Support
document.addEventListener("DOMContentLoaded", async () => {
  // Modal elements
  const backdrop = document.getElementById("backdrop")
  const detailsBox = document.getElementById("detailsBox")
  const detailIcon = document.getElementById("detailIcon")
  const detailTitle = document.getElementById("detailTitle")
  const detailCreator = document.getElementById("detailCreator")
  const detailType = document.getElementById("detailType")
  const downloadBtn = document.getElementById("downloadBtn")

  // Modal functions
  function openDetails(font) {
    const screenshotPath = `assets/fonts/screenshots/${font.name}.png`
    console.log(`Loading screenshot: ${screenshotPath}`)

    detailIcon.src = screenshotPath
    detailIcon.alt = `${font.displayName} screenshot`
    detailIcon.onerror = () => {
      console.log(`Screenshot not found: ${screenshotPath}, falling back to preview`)
      detailIcon.src = `assets/fonts/previews/${font.name}.png`
      detailIcon.onerror = () => {
        detailIcon.src = "assets/fonts/previews/placeholder.png"
      }
    }

    detailTitle.textContent = font.displayName || font.name
    detailCreator.textContent = font.creator || "Unknown"
    detailType.textContent = font.type === "original" ? "Original" : "Community"

    downloadBtn.onclick = (e) => {
      e.preventDefault()
      const fileName = font.file || `${font.name}.cia`
      const downloadUrl = `fonts/${fileName}`
      console.log(`Attempting download: ${downloadUrl}`)

      try {
        const link = document.createElement("a")
        link.href = downloadUrl
        link.download = fileName
        link.style.display = "none"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        console.log("Download initiated successfully")
      } catch (error) {
        console.error("Download failed:", error)
        window.open(downloadUrl, "_blank")
      }
    }

    backdrop.classList.add("show")
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.width = "100%"
    document.body.style.top = `-${window.scrollY}px`

    detailsBox.classList.remove("show", "hide")
    detailsBox.style.opacity = "0"
    detailsBox.style.transform = "scale(0.92)"
    setTimeout(() => detailsBox.classList.add("show"), 350)
  }

  function hideDetails() {
    detailsBox.classList.remove("show")
    detailsBox.classList.add("hide")
    setTimeout(() => {
      backdrop.classList.remove("show")
      const scrollY = document.body.style.top
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      document.body.style.overflow = ""
      if (scrollY) {
        window.scrollTo(0, Number.parseInt(scrollY || "0") * -1)
      }
    }, 350)
  }

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) hideDetails()
  })
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop.classList.contains("show")) {
      hideDetails()
    }
  })

  try {
    const res = await fetch("fonts.json")
    if (!res.ok) throw new Error("fonts.json failed to load")
    const fonts = await res.json()

    const originalGrid = document.getElementById("original-grid")
    const communityGrid = document.getElementById("community-grid")

    originalGrid.innerHTML = ""
    communityGrid.innerHTML = ""

    fonts.forEach((font) => {
      const card = document.createElement("div")
      card.className = "font-card"
      card.setAttribute("data-name", font.name)

      const img = document.createElement("img")
      img.className = "preview"
      img.src = `assets/fonts/previews/${font.name}.png`
      img.alt = `${font.displayName} preview`
      img.onerror = () => {
        img.src = "assets/fonts/previews/placeholder.png"
      }
      card.appendChild(img)

      if (font.type === "community" && font.creator) {
        const creator = document.createElement("div")
        creator.className = "creator"
        creator.textContent = `by ${font.creator}`
        card.appendChild(creator)
      }

      card.addEventListener("click", () => openDetails(font))

      if (font.type === "original") {
        originalGrid.appendChild(card)
      } else if (font.type === "community") {
        communityGrid.appendChild(card)
      }
    })
  } catch (err) {
    console.error("Error loading fonts.json:", err)

    const main = document.querySelector("main")
    const errEl = document.createElement("div")
    errEl.style.color = "#900"
    errEl.style.textAlign = "center"
    errEl.style.marginTop = "18px"
    errEl.textContent = "Failed to load fonts.json — check console for details."
    main.appendChild(errEl)
  }
})
