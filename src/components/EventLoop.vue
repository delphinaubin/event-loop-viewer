<template>
    <div class="el-container" >
        <div class="el-step time-step">
            Time
            <ul>
                <li v-for="(event, key) in sortedTimeEvents" :key="key" @click="event.execute()">
                    {{ event.instruction }} {{ event.time }}
                </li>
            </ul>
        </div>
        <div class="el-step io-step">
            IO
            <ul>
                <li v-for="(event, key) in queues.io" :key="key" @click="event.execute()">
                    {{ event.instruction }} (takes 90ms)
                </li>
            </ul>
        </div>
        <div class="el-step immediates-step">
            Immediates
            <ul>
                <li v-for="(event, key) in queues.immediates" :key="key" @click="event.execute()">
                    {{ event.instruction }}
                </li>
            </ul>
        </div>
        <div class="el-step close-handler-step">Close Handler</div>
    </div>
</template>

<script>
    export default {
        name: 'event-loop',
        props: ['queues'],
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
        width: 15rem;
        height: 100px;
        border: solid 2px red;
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

</style>