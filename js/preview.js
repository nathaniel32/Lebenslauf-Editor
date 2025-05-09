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
            width: 100%;
            min-height: 200px;
        }
        .dragging-item{
            background-color: red !important;
            border: 2px dashed #000 !important;
        }
        .drag-item {
            cursor: move;
            border: 2px solid #000;
        }
        
        * {
            scrollbar-width: thin;
            scrollbar-color: #dad3d3 #f0f0f0;
        }
        body {
            background-color: f0f0f0;
            width: 775px;
            height: 1105px;
            border: solid 1px black;
        }

        .header_container{
            width:100%;
        }
        .main_container{
            width:100%;
            display:flex;
        }
        .main_left_container{
            width:40%;
        }
        .main_right_container{
            width:60%;
        }
    `;
    iframeDoc.head.appendChild(style);
    
    document.getElementById('print_button').addEventListener('click', function() {
        iframe.contentWindow.print();
    });

    document.getElementById('editor_form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const telnr = document.getElementById('telnr').value;
        const email = document.getElementById('email').value;
        
        //const experiences = document.getElementById('experience').value.split('\n').filter(Boolean);
        //const educations = document.getElementById('education').value.split('\n').filter(Boolean);

        iframeDoc.body.innerHTML = `
            <div>
                <div class="header_container">
                    <h1 draggable="true">${name}</h1>
                </div>
                <div class="main_container">
                    <div class="main_left_container">
                        <div class="drag-container">
                            <p class="drag-item" draggable="true">${address}</p>
                        </div>
                    </div>
                    <div class="main_right_container">
                        <div class="drag-container">
                            <p class="drag-item" draggable="true">${telnr}</p>
                            <p class="drag-item" draggable="true">${email}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        /* <div class="drag-item" draggable="true">
            <h2>Ausbildung</h2>
            <ul>${educations.map(item => `<li>${item}</li>`).join('')}</ul>
        </div>
        <div class="drag-item" draggable="true">
            <h2>Berufserfahrung</h2>
            <ul>${experiences.map(item => `<li>${item}</li>`).join('')}</ul>
        </div> */
        const script = iframeDoc.createElement('script');
        script.src = 'js/drag.js';
        iframeDoc.body.appendChild(script);
    });
})();