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
        data: [0,1,2,3,4]
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: 'engagement_a',
            data: [3,8,4,3,8],
            type: 'line',
            smooth: true
        },
        {
            name: 'engagement_b',
            data: [7,3,4,3,6],
            type: 'line',
            smooth: true
        }
    ]
})


function calcConfidence(users: number, vote_a: number, vote_b: number): [string, number] {
    if (vote_a === 0 && vote_b === 0) {
        return ["-", 0.0];
    }
    if (vote_a === 0) {
        return ["B", 100.0];
    }
    if (vote_b === 0) {
        return ["A", 100.0];
    }
    try {
        if (vote_a >= vote_b) {
            // 使用假定比例检验的函数计算统计量和置信度
            const voteConfidenceA = zTest(vote_a, vote_b, users);
            return ["A", voteConfidenceA];
        } else {
            const voteConfidenceB = zTest(vote_b, vote_a, users);
            return ["B", voteConfidenceB];
        }
    } catch (error) {
        const totalVotes = vote_a + vote_b;
        if (vote_a > vote_b) {
            return ["A", (vote_a / totalVotes) * 100];
        } else {
            return ["B", (vote_b / totalVotes) * 100];
        }
    }
}

function zTest(count1: number, count2: number, users: number): number {
    // 一个简单的z检验的近似实现
    const p1 = count1 / users;
    const p2 = count2 / users;
    const p = (count1 + count2) / (2 * users);
    const z = (p1 - p2) / Math.sqrt(p * (1 - p) * 2 / users);
    // 使用z值生成p值，简单假设(Monte Carlo模拟或z表计算可以替换这里)
    const pValue = 1 - Math.abs(z);
    // 返回置信度
    return (1 - pValue) * 100;
}


const version_a = ref("hello world!")
const version_b = ref("你好世界！")
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

const like_confidence =ref(0)
const like_winner = ref("Nan")

const comment_confidence = ref(0)
const comment_winner = ref("Nan")

const share_confidence =ref(0)
const share_winner = ref("Nan")

const quote_confidence = ref(0)
const quote_winner = ref("Nan")



async function PredictClick() {
    const prompt_a = ref("")
    const prompt_b = ref("")
    const like_a = ref(0)
    const comment_a = ref(0)
    const quote_a = ref(0)
    const share_a = ref(0)
    const total_a = ref(0)
    const like_b = ref(0)
    const comment_b = ref(0)
    const quote_b = ref(0)
    const share_b = ref(0)
    const total_b = ref(0)
    const users = ref(0)

    option.value.xAxis.data =[]
    option.value.series[0].data =[]
    option.value.series[1].data =[]
    for (let i = 0; i < max_users.value; i++) {
        // console.log(`User ${i + 1}`);
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

        prompt_b.value = `You are scrolling through ${selectedPlatform.value} and came across the following content:
        '''
        ${version_b.value}
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
        const tasks_a  = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {role: "system", content: ""},
                {role: "user", content: prompt_a.value}
            ],
            response_format: {"type": "json_object"},
            store: true,
        });
        const tasks_b  = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {role: "system", content: ""},
                {role: "user", content: prompt_b.value}
            ],
            response_format: {"type": "json_object"},
            store: true,
        });
        const predictions_a  = JSON.parse(tasks_a.choices[0].message.content);
        const predictions_b  = JSON.parse(tasks_b.choices[0].message.content);


        like_a.value += predictions_a.like
        comment_a.value += predictions_a.comment
        share_a.value += predictions_a.share
        quote_a.value += predictions_a.quote
        total_a.value = like_a.value + comment_a.value + share_a.value + quote_a.value

        like_b.value += predictions_b.like
        comment_b.value += predictions_b.comment
        share_b.value += predictions_b.share
        quote_b.value += predictions_b.quote
        total_b.value = like_b.value + comment_b.value + share_b.value + quote_b.value

        option.value.xAxis.data.push(users.value)
        option.value.series[0].data.push(total_a.value)
        option.value.series[1].data.push(total_b.value)

        const [like_winner_results, like_confidence_results] = calcConfidence(users.value, like_a.value, like_b.value)
        const [comment_winner_results, comment_confidence_results] = calcConfidence(users.value, comment_a.value, comment_b.value)
        const [share_winner_results, share_confidence_results] = calcConfidence(users.value, share_a.value, share_b.value)
        const [quote_winner_results, quote_confidence_results] = calcConfidence(users.value, quote_a.value, quote_b.value)

        like_confidence.value = like_confidence_results
        like_winner.value = like_winner_results

        comment_confidence.value = comment_confidence_results
        comment_winner.value = comment_winner_results

        share_confidence.value = share_confidence_results
        share_winner.value = share_winner_results

        quote_confidence.value = quote_confidence_results
        quote_winner.value = quote_winner_results

        users.value+=1

    }


}

</script>

<template>
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
    <div class="grid grid-cols-4 gap-6 pt-4 pb-10">
        <div class="text-white">
            <p class="pt-2 font-bold text-xl">Likes</p>
            <p class="pt-2">{{ like_confidence.toFixed(2) }}% Vers.{{ like_winner }}</p>
        </div>
        <div class="text-white">
            <p class="pt-2 font-bold text-xl">Comments</p>
            <p class="pt-2">{{ comment_confidence.toFixed(2) }}% Vers.{{ comment_winner }}</p>
        </div>
        <div class="text-white">
            <p class="pt-2 font-bold text-xl">Shares</p>
            <p class="pt-2">{{ share_confidence.toFixed(2) }}% Vers.{{ share_winner }}</p>
        </div>
        <div class="text-white">
            <p class="pt-2 font-bold text-xl">Quotes</p>
            <p class="pt-2">{{ quote_confidence.toFixed(2) }}% Vers.{{ quote_winner }}</p>
        </div>
    </div>
</div>
</template>
