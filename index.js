import { Client } from "@gradio/client";

const client = await Client.connect("guymorlan/levanti_he_ar");

const api = {
    async audio(text){
        const result = await client.predict("/get_audio", { 		
            input_text: text, 
        });
        console.log(result.data);
    },
    async en2ar(){
        const result = await client.predict("/en2ar", { 		
            text: "ניסיון", 		
            dialect: "פלסטיני", 
        });
        console.log(result.data);
    },
    async run_translate(text){
        const client = await Client.connect("guymorlan/levanti_he_ar");
        const result = await client.predict("/run_translate", { 		
                text,
                dialect: "פלסטיני",
        });
        console.log(result.data);
        return result.data[1];
    },
    async diacriteize(text){
        const client = await Client.connect("guymorlan/levanti_he_ar");
        const result = await client.predict("/diacritize", { 		
                text, 
        });
        console.log(result.data);
        return result.data[0];
    },
    async trans_lettering(text){
        const client = await Client.connect("guymorlan/levanti_he_ar");
        const result = await client.predict("/taatik", { 		
                text, 
        });
        console.log(result.data);
    },
    async update_df(text){
        const result = await client.predict("/update_df", { 		
                hidden_arabic: text, 
        });
        
        console.log(result.data[0].value.data);
    }
};

(async function(){
    let text = await api.run_translate('ניסיון ראשון');
    let diacriteized = await api.diacriteize(text);
    api.audio(diacriteized);
    api.trans_lettering(diacriteized);
    api.update_df(text);
})();