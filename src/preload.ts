import bootstrap from 'bootstrap';

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    const version = process.versions[type];
    if (version) replaceText(`${type}-version`, version);
  }

  // Replace URLs
  Array.from(document.getElementsByTagName('img')).forEach(i => i.src = i.src.replace(/^file:\/\/\/\w:\//i, './'));

  window.onload = () => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    const footerTextLeft = document.getElementById('footer-text-left');
    if (footerTextLeft) footerTextLeft.textContent = `Planet's Lightning Arrester - ${new Date().getFullYear()}`;
    else console.warn(`Couldn't find 'footer-text-left'`);

    // Listen to clicks on drop zone
    const dropZone = document.getElementById('drop-zone');
    if (!dropZone) console.error("Couldn't get drop zone");
    else dropZone.onclick = filePickerOnClick;

    // Listen to drops on drop zone
    const dropZoneDiv = document.getElementById('drop-zone-div');
    if (!dropZoneDiv) console.error("Couldn't get drop zone");
    else dropZoneDiv.ondrop = filePickerOnDrop;

  };
});

function filePickerOnClick() {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.onchange = (e: any) => {
    console.log(e);
    if (e.target) {
      const files: Array<File> = Array.from(e.target.files);
      files[0].text().then(text => console.log(text));
    }
    console.log(e.target.files);
  };
  input.click();
}

function filePickerOnDrop(event: DragEvent) {
  event.preventDefault();
  console.log(event);
  if (event.dataTransfer) console.log(event.dataTransfer.files);
}