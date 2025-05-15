import config from './../../config.js';
import {preview} from './preview.js';
(() => {
    const editorMenu = document.getElementById('editor_menu');
    const editorMenuAdd = document.getElementById('editor_menu_add');
    const exportButton = document.getElementById('export_button');
    const importButton = document.getElementById('import_button');
    const importFileInput = document.getElementById('import_file_input');
    let menuArray = [];

    const form = document.getElementById('editor_form');
    function updatePreview(){
        preview.updatePreview(generateJSON(form));
        preview.iframe.contentWindow.callDrag(previewChangeListener);
    }

    function getImageExtension(mime) {
        const map = {
            "image/jpeg": "jpg",
            "image/pjpeg": "jpg",
            "image/png": "png",
            "image/gif": "gif",
            "image/webp": "webp",
            "image/bmp": "bmp",
            "image/x-windows-bmp": "bmp",
            "image/svg+xml": "svg",
            "image/tiff": "tif",
            "image/x-icon": "ico",
            "image/vnd.microsoft.icon": "ico",
            "image/heif": "heif",
            "image/heic": "heic"
        };

        return map[mime] || "";
    }

    function clearDisplayEditor(){
        menuArray.forEach(element => {
            element.style.display = 'none';
        });
    }

    function generateJSON(form) {
        function scanField(schema, scanElement){
            const dataJson = {};
            Object.entries(schema).forEach(([key, value]) => {
                const inputElement = scanElement.querySelector(`.${value.id}`);
                if(inputElement){
                    if (value.element === 'input') {
                        if(value.type === 'file'){
                            dataJson[value.id] = inputElement.getElementsByTagName(value.element)[0].getAttribute('blob-data');
                        }else{
                            dataJson[value.id] = inputElement.getElementsByTagName(value.element)[0].value;
                        }
                    }
                    if (value.element === 'select') {
                        dataJson[value.id] = inputElement.getElementsByTagName(value.element)[0].value;
                    }
                    if (value.element === 'button' || value.element === 'div'){
                        dataJson[value.id] = [];
                        inputElement.querySelectorAll(`.${value.id}`).forEach(element => {
                            dataJson[value.id].push(scanField(value.contents, element));
                        });
                    }
                }else{
                    if(value.return_data){
                        dataJson[value.id] = scanElement.getAttribute(value.return_data);
                    }
                }
            });
            return dataJson;
        }
        return scanField(config.editor_form_schema, form);
    }
    function createField(spec, resultsJson = null, parentMenuElement = null) {
        let resultsData = null;
        let returnData = null;
        const wrapper = document.createElement('div');
        wrapper.classList.add(spec.id);
        if (resultsJson){
            Object.entries(resultsJson).forEach(([key, value]) => {
                if (spec.id == key){
                    resultsData = value;
                }
            });
        }else{
            if (spec.default){
                const thisDefaultValue = config.default_value[spec.default];
                if (thisDefaultValue.uid){
                    resultsData = crypto.randomUUID();
                } else if (thisDefaultValue.data){
                    resultsData = thisDefaultValue.data[thisDefaultValue.default_array].id;
                }
            }
        }
        if (spec.return_data){
            returnData = {
                data: resultsData,
                attribute: spec.return_data
            };
        }

        function appendChildForm(containerParentElement, containerItemElement, resultData){
            let menuBtn = null;
            if(spec.menu){
                menuBtn = document.createElement('button');
                menuBtn.textContent = spec.menu_value;
                menuBtn.onclick = ()=>{
                    if (containerItemElement.style.display === 'none' || containerItemElement.style.display === '') {
                        clearDisplayEditor();
                        containerItemElement.style.display = 'block';
                    } else {
                        containerItemElement.style.display = 'none';
                    }
                }
                editorMenu.append(menuBtn);
                menuArray.push(containerItemElement);
            }

            spec.contents.forEach(childSpec => {
                const [childField, data] = createField(childSpec, resultData, menuBtn);
                if (data){
                    containerItemElement.setAttribute(data.attribute, data.data);
                }
                containerItemElement.appendChild(childField);
            });

            containerParentElement.appendChild(containerItemElement);
            return menuBtn;
        }
        
        if (spec.element === 'input') {
            const label = document.createElement('label');
            const span = document.createElement('span');
            span.textContent = spec.label;
            const input = document.createElement('input');
            input.type = spec.type;
            input.className = spec.id;
            label.appendChild(span);
            label.appendChild(input);
            if(spec.type === 'file' && spec.file_typ === 'img'){
                const fileContainer = document.createElement('div');
                fileContainer.classList = spec.id + '_container';
                const img = document.createElement('img');
                img.alt = spec.label;
                input.style.display = 'none';
                
                function change_file(init=false){
                    fileContainer.textContent = '';
                    input.setAttribute('blob-data', null);
                    const file = input.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function (e) {
                            img.src = e.target.result;
                            input.setAttribute('blob-data', e.target.result);
                            img.alt = spec.label;
                            fileContainer.appendChild(img);
                            updatePreview();
                        };
                        reader.readAsDataURL(file);
                    }else{
                        const imgLink = config.default_value[spec.default].link;
                        img.src = imgLink;
                        fileContainer.appendChild(img);
                        if (!init){
                            updatePreview();
                        }
                    }
                }
                input.accept = 'image/*'
                input.onchange = ()=>{
                    change_file();
                };
                change_file(true);
                label.appendChild(fileContainer);

                //------------------------------
                if (resultsData){
                    function base64ToBlob(base64, mime) {
                        const byteString = atob(base64.split(',')[1]);
                        const ab = new ArrayBuffer(byteString.length);
                        const ia = new Uint8Array(ab);
                        for (let i = 0; i < byteString.length; i++) {
                            ia[i] = byteString.charCodeAt(i);
                        }
                        return new Blob([ab], { type: mime });
                    }
                    const mime = resultsData.match(/^data:(.*);base64,/)[1];
                    const blob = base64ToBlob(resultsData, mime);
                    const ext = getImageExtension(mime);
                    const file = new File([blob], "profile."+ext, { type: mime });
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    input.files = dt.files;
                    change_file();
                }
            }else{
                input.value = resultsData;
                input.onchange = updatePreview;
            }
            wrapper.appendChild(label);
            return [wrapper, returnData];
        }

        if (spec.element === 'select') {
            const label = document.createElement('label');
            const span = document.createElement('span');
            span.textContent = spec.label;
            const select = document.createElement('select');
            select.className = spec.id;
            config.default_value[spec.default].data.forEach(optData => {
                const opt = document.createElement('option');
                opt.value = optData.id;
                opt.textContent = optData.text;
                select.appendChild(opt);
            });
            select.value = resultsData;
            label.appendChild(span);
            label.appendChild(select);
            wrapper.appendChild(label);

            if(spec.menu_value){
                function changeMenuName(){
                    const selectedId = select.value;
                    const found = config.default_value.content_option_title.data.find(obj => obj.id === selectedId);
                    if (found) {
                        parentMenuElement.textContent = found.text;
                    }
                }
                changeMenuName();
                select.onchange = ()=>{
                    changeMenuName();
                    updatePreview();
                };
            }
            return [wrapper, returnData];
        }
        if (spec.element === 'div') {
            const container = document.createElement('div');
            container.classList.add(spec.id + '_wrapper');

            function addChildForm(resultData = null){
                const fieldset = document.createElement('fieldset');
                fieldset.classList.add(spec.id);
                const legend = document.createElement('legend');
                legend.textContent = spec.label;
                fieldset.appendChild(legend);
                
                const menuBtn = appendChildForm(container, fieldset, resultData);
            }

            if (resultsData){
                resultsData.forEach(resultData => {
                    addChildForm(resultData);
                });
            }else{
                addChildForm();
            }

            wrapper.appendChild(container);
            return [wrapper, returnData];
        }

        if (spec.element === 'button') {
            const container = document.createElement('div');
            container.classList.add(spec.id + "_wrapper");

            function addChildForm(resultData = null){
                const fieldset = document.createElement('fieldset');
                fieldset.classList.add(spec.id);
                const legend = document.createElement('legend');
                legend.textContent = spec.label;

                /* if(!spec.show_parent){
                    const hideBtn = document.createElement('button');
                    hideBtn.type = 'button';
                    hideBtn.textContent = '-';
                    hideBtn.classList.add('hidden-btn');
                    fieldset.appendChild(hideBtn);

                    hideBtn.addEventListener('click', () => {
                        fieldset.style.display = 'none';
                    });
                } */
                
                fieldset.appendChild(legend);

                const menuBtn = appendChildForm(container, fieldset, resultData);

                // remove button
                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.textContent = '×';
                removeBtn.classList.add('remove-btn');
                fieldset.appendChild(removeBtn);

                removeBtn.addEventListener('click', () => {
                    const delete_confirm = confirm('Delete this ' + spec.label);
                    if (delete_confirm) {
                        fieldset.remove();
                        if(menuBtn){
                            menuBtn.remove();
                        }
                        updatePreview();
                    }
                });
            }

            if (resultsData){
                resultsData.forEach(resultData => {
                    addChildForm(resultData);
                });
            }

            function createAddBtn(container){
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = spec.id + '_button';
                btn.textContent = 'Add ' + spec.label;
                btn.addEventListener('click', () => {
                    if(!spec.show_parent){
                        clearDisplayEditor();
                    }
                    addChildForm();
                    updatePreview();
                });
                container.appendChild(btn);
            }
            
            wrapper.appendChild(container);

            if(spec.add_menu){
                createAddBtn(editorMenuAdd);
            }
            if(spec.show_parent){
                createAddBtn(wrapper);
            }

            return [wrapper, returnData];
        }

        return [document.createTextNode(''), returnData];
    }

    function previewChangeListener(draggedId, targetId, containerId){
        //console.log(draggedId, targetId, containerId);
        const draggedElement = document.querySelector(`[drag_id="${draggedId}"]`);
        if (draggedElement) {
            draggedElement.setAttribute("drag_container", containerId);
            if(targetId){
                const targetElement = document.querySelector(`[drag_id="${targetId}"]`);
                targetElement.parentNode.insertBefore(draggedElement, targetElement);
            }else{
                //const parentElement = draggedElement.parentElement;
                //parentElement.appendChild(draggedElement);
                if(draggedElement.nextSibling){
                    draggedElement.parentNode.insertBefore(draggedElement.nextSibling, draggedElement);
                }
            }
        }else{
            console.error("Error!");
        }
    }

    function downloadJSON(data, filename = 'data.nat') {
        const jsonStr = JSON.stringify(data, null, 0);
        const blob = new Blob([jsonStr], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    function importJSON(event){
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                init(JSON.parse(e.target.result));
            } catch (err) {
                console.error('Error parsing JSON:', err);
            }
        };
        reader.readAsText(file);
    }

    exportButton.onclick = ()=>{
        downloadJSON(generateJSON(form))
    };

    importButton.onclick = ()=>{
        importFileInput.click();
    }

    importFileInput.addEventListener('change', function(event) {
        importJSON(event);
    });

    function init(result){
        menuArray = [];
        editorMenu.textContent = '';
        editorMenuAdd.textContent = '';
        form.textContent = '';
        config.editor_form_schema.forEach(spec => {
            const [field, data] = createField(spec, result, null);
            form.appendChild(field);
        });
        clearDisplayEditor();
    }
    window.onload = () => init(null);
})();