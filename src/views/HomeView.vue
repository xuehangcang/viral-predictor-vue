<script setup lang="ts">
import {ref} from "vue";
import OpenAI from "openai";


const option = ref({
    backgroundColor: '#030712',
    legend: {
        data: ['engagement_a', 'engagement_b']
    },
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: 'engagement_a',
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true
        },
        {
            name: 'engagement_b',
            data: [810, 4, 901, 934, 1290, 1230, 1320],
            type: 'line',
            smooth: true
        }
    ]
})


const version_a = ref("")
const version_b = ref("")
const selectedPlatform = ref("Twitter")
const platforms = ref([
    {name: 'Twitter', value: 'Twitter'},
    {name: 'TikTok', value: 'TikTok'},
    {name: 'Instagram', value: 'Instagram'},
    {name: 'LinkedIn', value: 'LinkedIn'},
    {name: 'Facebook', value: 'Facebook'},
    {name: 'Hacker News', value: 'Hacker News'},
    {name: 'Reddit', value: 'Reddit'},
    {name: 'Blog Post', value: 'Blog Post'},
])
const max_users = ref(20)
const openai_api_key = ref("")
const model_type = ref("openai/gpt-4o")


const prompt_a = ref()

async function PredictClick() {
    prompt_a.value = `You are scrolling through ${selectedPlatform.value} and came across the following content:
    '''
    ${version_a.value}
    '''
    Decide whether to like, comment, share (retweet, repost, etc.), or quote.
        Output your decision as a JSON object with the following fields:
        - like: bool
        - comment: bool
        - share: bool
        - quote: bool"
    `;
    const openai = new OpenAI({
        apiKey: openai_api_key.value,
        dangerouslyAllowBrowser: true
    });
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {role: "system", content: ""},
            {role: "user", content: prompt_a.value}
        ],
        response_format: {"type": "json_object"},
        store: true,
    });
    console.log(completion.choices[0].message.content);
    const decision = JSON.parse(completion.choices[0].message.content);
    console.log(decision.like);     // Output: true
    console.log(decision.comment);  // Output: false
    console.log(decision.share);    // Output: false
    console.log(decision.quote);    // Output: false
}

</script>

<template>

    <div class="bg-gray-950 h-screen">
        <div class="container mx-auto pt-10">
            <h1 class="text-3xl text-white font-bold">Viral Predictor</h1>
            <p class="text-white pt-4 font-bold">Simulate how users react to your content so you know it'll go viral
                before you post</p>

            <div class="grid grid-cols-2 gap-6">
                <div class="">
                    <h1 class="text-2xl text-white font-bold pt-10">Version A</h1>
                    <p class="text-white text-sm pt-2">Enter your content here</p>
                    <div class="pt-2">
                        <textarea
                            class="bg-gray-800 pl-2 w-full h-60 rounded-lg focus:outline-none focus:ring ring-gray-500 text-white"
                            rows="4" v-model="version_a"></textarea>
                    </div>
                    <p class="text-white text-sm pt-2">Platform</p>
                    <div class="pt-2">
                        <select
                            class="text-white pl-2 bg-gray-800 w-full h-10 rounded-lg focus:outline-none focus:ring ring-gray-500"
                            v-model="selectedPlatform">
                            <option v-for="platform in platforms" :key="platform.value" :value="platform.value">
                                {{ platform.name }}
                            </option>
                        </select>
                    </div>
                    <p class="text-white text-sm pt-2">OpenRouter API Key</p>
                    <div class="pt-2">
                        <input
                            class="bg-gray-800 pl-2 w-full h-10 rounded-lg focus:outline-none focus:ring ring-gray-500 text-white"
                            type="text" v-model="openai_api_key">
                    </div>
                    <div class="pt-6">
                        <button
                            class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring ring-gray-500"
                            @click="PredictClick">
                            Predict
                        </button>
                    </div>
                </div>

                <div class="">
                    <h1 class="text-2xl text-white font-bold pt-10">Version B</h1>
                    <p class="text-white text-sm  pt-2">Enter your content here</p>
                    <div class="pt-2">
                        <textarea
                            class="bg-gray-800 pl-2 w-full h-60 rounded-lg focus:outline-none focus:ring ring-gray-500 text-white"
                            rows="4" v-model="version_b"></textarea>
                    </div>
                    <p class="text-white text-sm  pt-2">Max Users</p>
                    <div class="pt-2">
                        <input
                            class="bg-gray-800 pl-2 w-full h-10 rounded-lg focus:outline-none focus:ring ring-gray-500 text-white"
                            type="text" v-model="max_users">
                    </div>
                    <p class="text-white text-sm  pt-2">Model</p>
                    <div class="pt-2 ">
                        <input
                            class="bg-gray-800 pl-2 w-full h-10 rounded-lg focus:outline-none focus:ring ring-gray-500 text-white"
                            type="text" v-model="model_type">
                    </div>
                </div>
            </div>
            <h1 class="text-2xl text-white font-bold pt-10">Cumulative Engagement</h1>

            <div class="">
                <v-chart class="" autoresize :option="option" theme="dark" style="height: 400px"></v-chart>
            </div>

            <h1 class="text-2xl text-white font-bold">Statistical Confidence</h1>
            <div class="grid grid-cols-4 gap-6 pt-4 ">
                <div class="text-white">
                    <p class="pt-2 font-bold text-xl">Likes</p>
                    <p class="pt-2">0% Vers. ?</p>
                </div>
                <div class="text-white">
                    <p class="pt-2 font-bold text-xl">Comments</p>
                    <p class="pt-2">0% Vers. ?</p>
                </div>
                <div class="text-white">
                    <p class="pt-2 font-bold text-xl">Shares</p>
                    <p class="pt-2">0% Vers. ?</p>
                </div>
                <div class="text-white">
                    <p class="pt-2 font-bold text-xl">Quotes</p>
                    <p class="pt-2">0% Vers. ?</p>
                </div>
            </div>
        </div>


    </div>

</template>
