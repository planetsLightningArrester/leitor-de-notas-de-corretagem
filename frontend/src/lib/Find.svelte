<script lang="ts">
  let search: string = "";
  interface Matches {
    element: HTMLElement;
    originalColor: string;
  }
  let lastMatches: Matches[] = [];
  function clearMatches() {
    try {
      let match: Matches | undefined;
      while ((match = lastMatches.shift()) !== undefined) {
        match.element.style.color = match.originalColor;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Listen to Ctrl + F
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.ctrlKey && e.key === "f") {
        const find = document.getElementById("find");
        if (find) find.focus();
      } else if (e.key === "Escape") {
        const find = document.getElementById("find");
        if (find) find.blur();
        clearMatches();
        search = "";
      }
    },
    false
  );

  $: {
    // Clear previous matches
    if (lastMatches.length) {
      clearMatches();
    }
    if (search) {
      const lowerSearch = search.toLowerCase();
      Array.from(document.getElementsByTagName("*")).forEach((el) => {
        if (
          el instanceof HTMLElement &&
          el.innerText.toLocaleLowerCase().includes(lowerSearch)
        ) {
          lastMatches.push({
            element: el,
            originalColor: el.style.color,
          });
          el.setAttribute("style", "color: yellow!important");
        }
      });
    }
  }
</script>

<div id="find-div">
  <input
    id="find"
    type="text"
    name="find"
    placeholder="Procurar..."
    bind:value={search}
    style="position: absolute;top: 10px;right: 10px;z-index:1"
  />
</div>

<style>
  #find-div {
    position: absolute;
    top: 10px;
    right: 10px;
  }
</style>
