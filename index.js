import { Client } from "@gradio/client";

const client = await Client.connect("guymorlan/levanti_he_ar");

const api = {
    /**
     * Creates an audio of an Arabic sentence.
     * @param {String} text A diacritized Arabic text
     * @returns An object with a path to an audio file
     */
    async get_audio(text){
        const result = await client.predict("/get_audio", { 		
            input_text: text, 
        });
        return result.data;
    },
    /**
     * Translates a sentence in Hebrew into Arabic.
     * @param {String} text A text in Hebrew.
     * @returns An arabic translation.
     */
    async get_translation(text){
        const client = await Client.connect("guymorlan/levanti_he_ar");
        const result = await client.predict("/run_translate", { 		
                text,
                dialect: "פלסטיני",
        });
        return result.data[1];
    },
    /**
     * Diacritizes an Arabic text.
     * @param {String} text Arabic text.
     * @returns Diacritized text.
     */
    async get_diacritize(text){
        const client = await Client.connect("guymorlan/levanti_he_ar");
        const result = await client.predict("/diacritize", { 		
                text, 
        });
        return result.data[0];
    },
    /**
     * Creates a taatik (transliteration) in Hebrew of an Arabic text.
     * @param {String} text Diacritized Arabic text.
     * @returns Hebrew transliteration of the text
     */
    async get_taatik(text){
        const client = await Client.connect("guymorlan/levanti_he_ar");
        const result = await client.predict("/taatik", { 		
                text, 
        });
        return result.data;
    },
    /**
     * Gets a list of similar sentences translated in the past.
     * @param {String} text Arabic text.
     * @returns A list of Arabic sentences and their Hebrew transliterations.
     */
    async get_similar(text){
        const result = await client.predict("/update_df", { 		
                hidden_arabic: text, 
        });
        return result.data[0].value.data;
    },
    /**
     * A function to grub all available features in one go.
     * @param {String} text Hebrew text for translation.
     * @returns Data from all the functions above.
     */
    async get_all_data(text){
        let translation = await api.get_translation(text);
        let [diacriteized, suggestions] = await Promise.all([
            this.get_diacritize(translation),
            this.get_similar(translation),
        ]);
        let [audio, taatik] = await Promise.all([
            this.get_audio(diacriteized),
            this.get_taatik(diacriteized),
        ]);
        return {translation, diacriteized, suggestions, audio, taatik};
    }
};

// (async function(){
//     console.log(await api.get_all_data('אני בודק שהכל עובד חלק.'));
// })();
