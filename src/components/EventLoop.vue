<template>
    <div class="el-container" >
        <h1>{{ currentTime }} ms</h1>
        <img id="ela1" class="el-arrow" src="event-loop-arrow.svg" />
        <img id="ela2" class="el-arrow" src="event-loop-arrow.svg" />
        <img id="ela3" class="el-arrow" src="event-loop-arrow.svg" />
        <img id="ela4" class="el-arrow" src="event-loop-arrow.svg" />
        <div class="el-step time-step">
            <h2>Time</h2>
            <ul>
                <li v-for="(event, key) in sortedTimeEvents" :key="key" @click="event.execute()">
                    {{ event.instruction }} {{ event.time }}
                </li>
            </ul>
        </div>
        <div class="el-step io-step">
            <h2>IO</h2>
            <ul>
                <li v-for="(event, key) in queues.io" :key="key" @click="event.execute()">
                    {{ event.instruction }} (takes 90ms)
                </li>
            </ul>
        </div>
        <div class="el-step immediates-step">
            <h2>Immediates</h2>
            <ul>
                <li v-for="(event, key) in queues.immediates" :key="key" @click="event.execute()">
                    {{ event.instruction }}
                </li>
            </ul>
        </div>
        <div class="el-step close-handler-step">
            <h2>Close Handler</h2>
            <ul></ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'event-loop',
        props: ['queues', 'current-time'],
        computed: {
            sortedTimeEvents: function () {
                return [].concat(this.queues.timers).sort((t1, t2) => t2.time - t1.time)
            }
        }
    }
</script>

<style>
    .el-step {
        position: absolute;
    }
    .el-step ul {
        width: 15rem;
        height: 100px;
        padding-top: 1rem;
        border: dashed 2px #88FF88;
        list-style: none;
        text-align: left;
        color: #FFF;
        font-family: 'Courier New', Courier, monospace;
    }
    .el-container {
        height: 600px;
        position: relative;
    }
    .time-step {
        top: 0;
        left: 0;
    }
    .io-step {
        top: 0;
        right: 0;
    }
    .immediates-step {
        right: 0;
        bottom: 0;
    }
    .close-handler-step {
        left: 0;
        bottom: 0;
    }

    .el-arrow {
        position: absolute;
        height: 10rem;
    }
    #ela1 {
        top: 5rem;
        left: 20rem;
    }
    #ela2 {
        left: 20rem;
        bottom: 5rem;
        transform: rotate(-90deg);
    }
    
    #ela3 {
        top: 5rem;
        right: 20rem;
        transform: rotate(90deg);
    }
    #ela4 {
        right: 20rem;
        bottom: 5rem;
        transform: rotate(180deg);   
    }
</style>