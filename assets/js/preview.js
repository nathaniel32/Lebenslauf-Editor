import config from './../../config.js';
export const preview = (() => {
    const iframe = document.getElementById('editor_preview');
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
        body {
            padding: 30px 15px 10px 15px;
            margin: 0;
            width: 795px;
            height: 1123px;
            overflow: hidden;
            border: 1px dashed #000 !important;
        }
        
        .drag-container{
        }
        .dragging-item{
            border: 1px dashed #000 !important;
        }
        .drag-item {
        }
    `;
    iframeDoc.head.appendChild(style);

    const script = iframeDoc.createElement('script');
    script.src = 'assets/js/drag.js';
    iframeDoc.head.appendChild(script);

    const script1 = iframeDoc.createElement('script');
    script1.src = 'https://cdn.tailwindcss.com';
    iframeDoc.head.appendChild(script1);
    
    document.getElementById('print_button').addEventListener('click', function() {
        iframe.contentWindow.print();
    });

    function updatePreview1(data){
        console.log(JSON.stringify(data, null, 2));
        iframeDoc.body.textContent = "";

        //header
        const headerContainer = document.createElement('div');
        const profileName = document.createElement('h1');       //-----------------------------------------
        const profileFoto = document.createElement('img');
        const profileAddress = document.createElement('p');     //-----------------------------------------
        const profileTelnr = document.createElement('p');       //-----------------------------------------
        const profileEmail = document.createElement('p');       //-----------------------------------------

        const profile = data.f_profile?.[0] ?? {};
        profileName.textContent = profile.f_name ?? null;
        profileFoto.src = profile.f_foto ?? null;
        profileAddress.textContent = profile.f_address ?? null;
        profileTelnr.textContent = profile.f_telnr ?? null;
        profileEmail.textContent = profile.f_email ?? null;

        headerContainer.appendChild(profileName);
        headerContainer.appendChild(profileFoto);
        headerContainer.appendChild(profileAddress);
        headerContainer.appendChild(profileTelnr);
        headerContainer.appendChild(profileEmail);
        iframeDoc.body.appendChild(headerContainer);
        //---------------------------------------

        const contentContainer = document.createElement('div');
        contentContainer.classList = 'content_container';
        config.default_value.default_container_schema.data.forEach(schema => {
            const dragDirContainer = document.createElement('div');
            dragDirContainer.classList = schema.class;
            const dragContainer = document.createElement('div');
            dragContainer.id = schema.id;
            dragContainer.classList = "drag-container";
            if(data.f_contents){
                data.f_contents.forEach(content => {
                    if (schema.id == content.f_content_container){
                        //content
                        const dragItem = document.createElement('div');
                        dragItem.id = content.f_content_id;
                        dragItem.classList = 'drag-item';
                        dragItem.draggable = true;
                        const contentTitle = document.createElement('h3');          //-----------------------------------------
                        contentTitle.textContent = config.default_value.content_option_title.data.find(obj => obj.id === content.f_title).text;
                        dragItem.appendChild(contentTitle);
                        content.f_infos.forEach(info => {
                            //info
                            const infoAction = document.createElement('span');         //-----------------------------------------
                            const infoInstitution = document.createElement('span');    //-----------------------------------------
                            const infoLocation = document.createElement('span');       //-----------------------------------------
                            const infoFrom = document.createElement('span');           //-----------------------------------------
                            const infoUntil = document.createElement('span');          //-----------------------------------------

                            infoAction.textContent = info.f_action;
                            infoInstitution.textContent = info.f_institution;
                            infoLocation.textContent = info.f_location;
                            infoFrom.textContent = info.f_from;
                            infoUntil.textContent = info.f_until;

                            dragItem.appendChild(infoAction);
                            dragItem.appendChild(infoInstitution);
                            dragItem.appendChild(infoLocation);
                            dragItem.appendChild(infoFrom);
                            dragItem.appendChild(infoUntil);
                            
                            info.f_notes?.forEach(note => {
                                const infoNote = document.createElement('span');
                                infoNote.textContent = note.f_note;
                                dragItem.appendChild(infoNote);
                            });
                        });
                        dragContainer.appendChild(dragItem);
                    }
                });
            }
            dragDirContainer.appendChild(dragContainer);
            contentContainer.appendChild(dragDirContainer);
        });
        iframeDoc.body.appendChild(contentContainer);
    }

    function updatePreview(data){
        //console.log(JSON.stringify(data, null, 2));
        iframeDoc.body.innerHTML = `
            <header id="profile" class="text-center mb-10"></header>

            <div class="grid grid-cols-2 gap-8">
                <!-- Left Column -->
                <div id="pv_left" class="space-y-8 drag-container"></div>
                <!-- Right Column -->
                <div id="pv_right" class="space-y-8 drag-container"></div>
            </div>
        `
        // Render profile header
        const profile = data.f_profile[0];
        const headerEl = iframeDoc.getElementById('profile');
        const profileImg = (profile.f_foto == "null") ? config.default_value.default_img_profile.link : profile.f_foto;
        headerEl.innerHTML = `
            <img src="${profileImg}" alt="Foto ${profile.f_name}" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover">
            <h1 class="text-4xl font-bold text-blue-700">${profile.f_name}</h1>
            <!-- <p class="text-gray-600">Softwareentwickler</p> -->
            <div class="mt-2 text-sm text-gray-500">
                <p>${profile.f_email} | ${profile.f_telnr}</p>
                <p>${profile.f_address}</p>
            </div>
        `;

        // Render sections
        data.f_contents.forEach(section => {
            const container = iframeDoc.getElementById(section.f_content_container);
            // Section title
            const sectionEl = iframeDoc.createElement('section');
            sectionEl.className = 'mb-4 drag-item';
            sectionEl.id = section.f_content_id;
            sectionEl.draggable = true;
            sectionEl.innerHTML = `
                <h2 class="text-2xl font-semibold text-blue-600 border-b pb-2 mb-4">${config.default_value.content_option_title.data.find(obj => obj.id === section.f_title).text}</h2>
            `;

            // For each info block
            section.f_infos.forEach(info => {
                const infoEl = iframeDoc.createElement('div');
                infoEl.className = 'mb-4';
                // Title line if action exists
                if (info.f_action) {
                    infoEl.innerHTML += `<h3 class="text-lg font-bold">${info.f_action} – ${info.f_institution}</h3>`;
                    infoEl.innerHTML += `<p class="text-sm text-gray-500">${info.f_from} – ${info.f_until}${info.f_location ? ' | ' + info.f_location : ''}</p>`;
                }
                // Notes list
                if (info.f_notes && info.f_notes.length) {
                    const ul = iframeDoc.createElement('ul');
                    ul.className = 'list-disc ml-5 text-gray-700';
                    info.f_notes.forEach(note => {
                        const li = iframeDoc.createElement('li');
                        li.textContent = note.f_note;
                        ul.appendChild(li);
                    });
                    infoEl.appendChild(ul);
                }
                sectionEl.appendChild(infoEl);
            });

            container.appendChild(sectionEl);
        });
    }
    return {updatePreview, iframe};
})();
