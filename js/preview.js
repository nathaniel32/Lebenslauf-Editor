(() => {
    const iframe = document.getElementById('editor-preview');
    const iframeDoc = iframe.contentWindow.document;

    if (!iframeDoc.head) {
        const head = iframeDoc.createElement('head');
        iframeDoc.documentElement.appendChild(head);
    }

    const metaCharset = iframeDoc.createElement('meta');
    metaCharset.setAttribute('charset', 'UTF-8');
    iframeDoc.head.appendChild(metaCharset);

    const metaViewport = iframeDoc.createElement('meta');
    metaViewport.setAttribute('name', 'viewport');
    metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    iframeDoc.head.appendChild(metaViewport);

    const style = iframeDoc.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
        @media print {
            @page {
                size: A4;
                margin: 0;
            }
        }
        .drag-container{
            width: 50%;
        }
        .drag-item {
            cursor: move;
            border: 2px solid #000;
        }
        .drag-over {
            border: 2px dashed #000;
        }
        
        * {
            scrollbar-width: thin;
            scrollbar-color: #dad3d3 #f0f0f0;
        }
        body {
            background-color: rgb(156, 67, 67);
            width: 775px;
            height: 1105px;
            border: solid 1px black;
        }
    `;
    iframeDoc.head.appendChild(style);
    
    document.getElementById('print_button').addEventListener('click', function() {
        iframe.contentWindow.print();
    });

    document.getElementById('editor_form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const contact = document.getElementById('contact').value;
        const experiences = document.getElementById('experience').value.split('\n').filter(Boolean);
        const educations = document.getElementById('education').value.split('\n').filter(Boolean);

        iframeDoc.body.innerHTML = `
            <div style="display:flex">
                <div class="drag-container">
                    <h1 class="drag-item" draggable="true">${name}</h1>
                    <p class="drag-item" draggable="true">${contact}</p>
                    <div class="drag-item" draggable="true">
                        <h2>Berufserfahrung</h2>
                        <ul>${experiences.map(item => `<li>${item}</li>`).join('')}</ul>
                    </div>
                    <div class="drag-item" draggable="true">
                        <h2>Ausbildung</h2>
                        <ul>${educations.map(item => `<li>${item}</li>`).join('')}</ul>
                    </div>
                </div>
                <div class="drag-container">
                    <h1 class="drag-item" draggable="true">${name}</h1>
                </div>
            </div>
        `;
        const script = iframeDoc.createElement('script');
        script.src = 'js/drag.js';
        iframeDoc.body.appendChild(script);
    });
})();