<script setup lang="ts">

</script>

<template>

<div class="bg-gray-950 h-screen w-full">
    <div class="container mx-auto pt-10">
        <h1 class="text-3xl text-white font-bold">Viral Predictor</h1>
        <p class="text-white pt-4 font-bold">Simulate how users react to your content so you know it'll go viral before you post</p>

        <div class="grid grid-cols-2 gap-6">
            <div class="">
                <h1 class="text-2xl text-white font-bold pt-10">Version A</h1>
                <p class="text-white text-sm pt-2">Enter your content here</p>
                <div class="pt-2">
                    <input class="bg-gray-800 text-white w-full h-60 rounded-lg focus:outline-none focus:ring ring-gray-500" type="text">
                </div>
                <p class="text-white text-sm pt-2">Platform</p>
                <div class="pt-2">
                    <select class="text-white pl-2  bg-gray-800 w-full h-10 rounded-lg focus:outline-none focus:ring ring-gray-500">
                        <option value="Twitter" selected>Twitter</option>
                        <option value="TikTok">TikTok</option>
                        <option value="Instagram">Instagram</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Hacker News">Hacker News</option>
                        <option value="Reddit">Reddit</option>
                        <option value="Blog Post">Blog Post</option>
                    </select>
                </div>
                <p class="text-white text-sm pt-2">OpenRouter API Key</p>
                <div class="pt-2">
                    <input class="bg-gray-800 pl-2 w-full h-10 rounded-lg focus:outline-none focus:ring ring-gray-500 text-white" type="text">
                </div>
                <div class="pt-6">
                    <button class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring ring-gray-500">
                        Predict
                    </button>
                </div>
            </div>

            <div class="">
                <h1 class="text-2xl text-white font-bold pt-10">Version B</h1>
                <p class="text-white text-sm  pt-2">Enter your content here</p>
                <div class="pt-2">
                    <input class="bg-gray-800 text-white w-full h-60 rounded-lg focus:outline-none focus:ring ring-gray-500" type="text">
                </div>
                <p class="text-white text-sm  pt-2">Max Users</p>
                <div class="pt-2">
                    <input class="bg-gray-800 pl-2 w-full h-10 rounded-lg focus:outline-none focus:ring ring-gray-500 text-white" type="text" value="20">
                </div>
                <p class="text-white text-sm  pt-2">Model</p>
                <div class="pt-2 ">
                    <input class="bg-gray-800 pl-2 w-full h-10 rounded-lg focus:outline-none focus:ring ring-gray-500 text-white" type="text" value="openai/gpt-4o">
                </div>
            </div>
        </div>
        <h1 class="text-2xl text-white font-bold pt-10">Cumulative Engagement</h1>
    </div>
</div>

</template>
