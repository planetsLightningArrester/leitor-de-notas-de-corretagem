<script context="module" lang="ts">
  import { _ } from 'svelte-i18n'
  interface Matches {
    element: HTMLElement
    originalColor: string
  }
  const lastMatches: Matches[] = []
  /**
   * Clear the Find search
   * @param clearInput whether to clear also the text input. Default is `false`
   */
  export function clearMatches(clearInput = false): void {
    try {
      let match: Matches | undefined
      while ((match = lastMatches.shift()) !== undefined) {
        match.element.style.color = match.originalColor
      }
      if (clearInput) {
        const find = document.getElementById('find') as unknown as HTMLInputElement
        if (find !== null) find.value = ''
      }
    } catch (error) {
      console.log(error)
    }
  }
</script>

<script lang="ts">
  let search: string = ''

  // Listen to Ctrl + F
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.ctrlKey && e.key === 'f') {
        const find = document.getElementById('find')
        if (find !== null) find.focus()
      } else if (e.key === 'Escape') {
        const find = document.getElementById('find')
        if (find !== null) find.blur()
        clearMatches(true)
      }
    },
    false,
  )

  $: {
    // Clear previous matches
    if (lastMatches.length > 0) {
      clearMatches()
    }
    if (search !== '') {
      const lowerSearch = search.toLowerCase()
      const tableContainerElement = document.getElementById('table-container')
      if (tableContainerElement !== null) {
        Array.from(tableContainerElement.getElementsByTagName('*')).forEach((el) => {
          if (el instanceof HTMLElement && el.innerText.toLocaleLowerCase().includes(lowerSearch)) {
            lastMatches.push({
              element: el,
              originalColor: el.style.color,
            })
            const previous = el.getAttribute('style')
            el.setAttribute('style', previous + ';color: yellow!important')
          }
        })
      }
    }
  }
</script>

<div id="find-div">
  <input id="find" data-testid="find" type="text" name="find" placeholder={$_('find.find')} bind:value={search} style="position: absolute;top: 10px;right: 10px;z-index:1" />
</div>

<style>
  #find-div {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  #find {
    border-radius: 12px;
    padding: 3px 6px 3px 6px;
  }
</style>
