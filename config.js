const config= {
    "default_value":{
        "default_container_schema":{
            "default_array": "0",
            "data": [
                {"id": "pv_left", "class": "content_left_container"},
                {"id": "pv_right", "class": "content_right_container"}
            ]
        },
        "default_uuid":{
            "uid": true
        },
        "content_option_title":{
            "default_array": "0",
            "data": [
                {"id":"0", "text": "Unbenannt"},
                {"id":"1", "text": "Kenntnisse"},
                {"id":"2", "text": "Sprachen"},
                {"id":"3", "text": "Berufserfahrung"},
                {"id":"4", "text": "Ausbildung"},
                {"id": "5", "text": "Führerschein"},
                {"id": "6", "text": "Fähigkeiten"},
                {"id": "7", "text": "Praktika"},
                {"id": "8", "text": "Projekte"},
                {"id": "9", "text": "Zertifikate"},
                {"id": "10", "text": "Hobbys"},
                {"id": "11", "text": "Referenzen"},
                {"id": "12", "text": "Publikationen"}
            ]
        },
        "default_profile":{
            "link": "assets/img/img_input.png"
        },
        "default_img_profile":{
            "link": "assets/img/profile.jpg"
        }
    },
    "editor_form_schema":[
        {"id":"f_profile", "element":"div", "label":"Profile", "menu": true, "menu_value": "Profile", "contents":[
            {"id":"f_name", "element":"input", "type":"text", "label":"Name"},
            {"id":"f_foto", "element":"input", "type":"file", "file_typ": "img", "label":"Foto", "default": "default_profile"},
            {"id":"f_address", "element":"input", "type":"text", "label":"Address"},
            {"id":"f_telnr", "element":"input", "type":"tel", "label":"Telefonnummer"},
            {"id":"f_email", "element":"input", "type":"email", "label":"Email"},
            {"id":"f_familienstand", "element":"input", "type":"text", "label":"Familienstand"},
            {"id":"f_staatsangehoerigkeit", "element":"input", "type":"text", "label":"Staatsangehörigkeit"},
            {"id":"f_github", "element":"input", "type":"text", "label":"GitHub"},
            {"id":"f_linkedin", "element":"input", "type":"text", "label":"LinkedIn"}
        ]},
        {"id":"f_contents", "element":"button", "label":"Content", "menu": true, "add_menu": true, "contents":[
            {"id":"f_content_id", "label":"Id", "default": "default_uuid", "return_data": "drag_id"},
            {"id":"f_content_container", "label":"Container", "default": "default_container_schema", "return_data": "drag_container"},
            {"id":"f_title", "element":"select", "type":"text", "label":"Title", "default": "content_option_title", "menu_value": true},
            {"id":"f_infos", "element":"button", "label":"Info", "show_parent":true, "contents":[
                {"id":"f_action", "element":"input", "type":"text", "label":"Action"},
                {"id":"f_institution", "element":"input", "type":"text", "label":"Institution"},
                {"id":"f_location", "element":"input", "type":"text", "label":"Location"},
                {"id":"f_from", "element":"input", "type":"date", "label":"From"},
                {"id":"f_until", "element":"input", "type":"date", "label":"Until"},
                {"id":"f_notes", "element":"button", "label":"Notes", "show_parent":true, "contents":[
                    {"id":"f_note", "element":"input", "type":"text", "label":"Note"}
                ]}
            ]}
        ]}
    ],
}
export default config;
