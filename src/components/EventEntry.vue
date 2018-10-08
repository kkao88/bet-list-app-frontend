<template>
    <form class="form" v-on:submit.prevent="submitForm">
        <div>
            <label>Date</label>
            <datepicker v-model="form.date" name="date"></datepicker>
        </div><br />
        <div>
            <label class="" for="time-hour">Hour</label>
            <select v-model="form.hour" id="time-hour">
                <option>12</option>
                <option>01</option>
                <option>02</option>
                <option>03</option>
                <option>04</option>
                <option>05</option>
                <option>06</option>
                <option>07</option>
                <option>08</option>
                <option>09</option>
                <option>10</option>
                <option>11</option>
            </select>
        </div>
        <div>
            <label class="" for="time-minute">Minute</label>
            <select v-model="form.minute" id="time-minute">
                <option>00</option>
                <option>05</option>
                <option>15</option>
                <option>20</option>
                <option>25</option>
                <option>30</option>
            </select>
        </div>
        <div>
            <label class="" for="time-ampm">AM PM</label>
            <select v-model="form.ampm" id="time-ampm">
                <option>PM</option>
                <option>AM</option>
            </select>
        </div>
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input id="away" v-model="form.awayTeam" class="mdl-textfield__input" type="text">
            <label class="mdl-textfield__label" for="away">Away Team</label>
        </div><br />
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input id="home" v-model="form.homeTeam" class="mdl-textfield__input" type="text">
            <label class="mdl-textfield__label" for="home">Home Team</label>
        </div><br />
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input id="line" v-model="form.line" class="mdl-textfield__input" type="text">
            <label class="mdl-textfield__label" for="line">Line</label>
        </div><br />
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            <input id="total" v-model="form.total" class="mdl-textfield__input" type="text">
            <label class="mdl-textfield__label" for="line">Total</label>
        </div><br />
        <div>
            <label class="" for="event-type">Event Type</label>
            <select v-model="form.type" id="event-type">
                <option>NFL</option>
                <option>CFB</option>
                <option>Other</option>
            </select>
        </div>
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
            Submit
        </button>
    </form>
</template>
<script>
    import {AXIOS} from '../config/http-commons';
    import moment from 'moment';
    import Datepicker from 'vuejs-datepicker';

    export default {
        name: 'EventEntry',
        components: {Datepicker},
        data () {
            return {
                form: {
                    date: null,
                    awayTeam: '',
                    homeTeam: '',
                    line: '',
                    type: '',
                    hour: '12',
                    minute: '00',
                    ampm: 'PM',
                    dateTime: '',
                    total: ''
                }
            }
        },
        methods: {
            submitForm: function(){
                let dateTime = moment(this.form.date);
                if (this.form.ampm === 'PM' && parseInt(this.form.hour) !== 12){
                    dateTime.hour(12+parseInt(this.form.hour));
                }
                else {
                    dateTime.hour(parseInt(this.form.hour));
                }
                dateTime.minute(this.form.minute);
                this.form.dateTime = dateTime.toISOString();

                AXIOS.put(`${process.env.VUE_APP_API_URL}/event`, this.form)
                    .then(function () {
                        console.log('success');
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            },
        }
    }
</script>