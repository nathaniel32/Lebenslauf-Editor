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
        .main_container {
            background-color: #ffffff;
            padding: 30px 40px 10px 40px;
            margin: 0;
            width: 795px;
            height: 1123px;
            overflow: hidden;
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

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css";
    link.integrity = "sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==";
    link.crossOrigin = "anonymous";
    link.referrerPolicy = "no-referrer";
    iframeDoc.head.appendChild(link);
    
    document.getElementById('print_button').addEventListener('click', function() {
        iframe.contentWindow.print();
    });

    function formatDate(dateStr) {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Monate sind 0-indexiert
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    function renderInfoHeader(from, until, location) {
    if (!from && !until && !location) return '';
        if (!from && !until) return location || '';
        
        const loc = location && (from || until) ? ' | ' + location : (location || '');
        const unt = until ? formatDate(until) : 'heute';
        if (!from) return unt + loc;
        return formatDate(from) + ' – ' + unt + loc;
    }

    function renderContactItem(iconClass, data) {
        if (!data) return '';
        return `
            <p class="flex items-center gap-2">
            <i class="${iconClass} text-gray-500 w-5"></i>
            <span>${data}</span>
            </p>
        `;
    }

    function updatePreview(data){
        //console.log(JSON.stringify(data, null, 2));
        iframeDoc.body.innerHTML = `
            <div class="main_container">
                <header id="profile" class="mt-5 flex mb-10"></header>
                <div class="grid grid-cols-[35%_65%] gap-8">
                    <!-- Left Column -->
                    <div id="pv_left" class="space-y-8 drag-container"></div>
                    <!-- Right Column -->
                    <div id="pv_right" class="space-y-8 drag-container"></div>
                </div>
            </div>
        `
        // Render profile header
        const profile = data.f_profile[0];
        const headerEl = iframeDoc.getElementById('profile');
        const profileImg = (profile.f_foto == "null") ? config.default_value.default_img_profile.link : profile.f_foto;
        headerEl.innerHTML = `
            <div class="">
                <h1 class="text-5xl font-bold text-blue-700">${profile.f_name}</h1>
                <div class="mx-1 mt-5 text-gray-600 space-y-1">
                    ${renderContactItem('fa-solid fa-envelope', profile.f_email)}
                    ${renderContactItem('fa-solid fa-phone', profile.f_telnr)}
                    ${renderContactItem('fa-solid fa-location-dot', profile.f_address)}
                    ${renderContactItem('fa-solid fa-children', profile.f_familienstand)}
                    ${renderContactItem('fa-solid fa-earth-americas', profile.f_staatsangehoerigkeit)}
                    ${renderContactItem('fa-brands fa-github', profile.f_github)}
                    ${renderContactItem('fa-brands fa-linkedin', profile.f_linkedin)}
                </div>
            </div>
            <div class="mx-auto self-center mt-2">
                <img src="${profileImg}" alt="Foto ${profile.f_name}" class="self-center w-40 h-40 object-cover rounded-md">
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
            sectionEl.innerHTML = `<h2 class="text-2xl font-semibold text-blue-600 border-b pb-2 mb-1">${config.default_value.content_option_title.data.find(obj => obj.id === section.f_title).text}</h2>`;

            // For each info block
            section.f_infos.forEach(info => {
                const infoEl = iframeDoc.createElement('div');
                infoEl.className = 'mb-4';
                // Title line if action exists
                if (info.f_action) {
                    infoEl.innerHTML += `<h3 class="text-lg font-bold">${info.f_action} – ${info.f_institution}</h3>`;
                    infoEl.innerHTML += `<p class="text-sm text-gray-500">${renderInfoHeader(info.f_from, info.f_until, info.f_location)}</p>`;
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
