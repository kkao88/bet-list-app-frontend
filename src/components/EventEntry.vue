<template>
    <form class="form" v-on:submit.prevent="submitForm">
        <div>
            <label>Date</label>
            <datepicker v-model="form.date" name="date"></datepicker>
        </div><br />
        <div>
            <md-field class="time-field">
                <label class="" for="time-hour">Hour</label>
                <md-select v-model="form.hour" id="time-hour">
                    <md-option value="12">12</md-option>
                    <md-option value="01">01</md-option>
                    <md-option value="02">02</md-option>
                    <md-option value="03">03</md-option>
                    <md-option value="04">04</md-option>
                    <md-option value="05">05</md-option>
                    <md-option value="06">06</md-option>
                    <md-option value="07">07</md-option>
                    <md-option value="08">08</md-option>
                    <md-option value="09">09</md-option>
                    <md-option value="10">10</md-option>
                    <md-option value="11">11</md-option>
                </md-select>
            </md-field>
            <md-field class="time-field">
                <label class="" for="time-minute">Minute</label>
                <md-select v-model="form.minute" id="time-minute">
                    <md-option value="00">00</md-option>
                    <md-option value="05">05</md-option>
                    <md-option value="15">15</md-option>
                    <md-option value="20">20</md-option>
                    <md-option value="20">25</md-option>
                    <md-option value="30">30</md-option>
                </md-select>
            </md-field>
            <md-field class="time-field">
                <label class="" for="time-ampm">AM PM</label>
                <md-select v-model="form.ampm" id="time-ampm">
                    <md-option value="PM">PM</md-option>
                    <md-option value="AM">AM</md-option>
                </md-select>
            </md-field>
        </div>
        <md-field>
            <label for="away">Away Team</label>
            <md-input id="away" v-model="form.awayTeam" type="text" required></md-input>
        </md-field>
        <md-field>
            <label for="home">Home Team</label>
            <md-input id="home" v-model="form.homeTeam" type="text" required></md-input>
        </md-field>
        <md-field>
            <label for="line">Line</label>
            <md-input id="line" v-model="form.line" type="text"></md-input>
        </md-field>
        <md-field>
            <label for="total">Total</label>
            <md-input id="total" v-model="form.total" type="text"></md-input>
        </md-field>
        <md-field>
            <label class="" for="event-type">Event Type</label>
            <md-select v-model="form.type" id="event-type" required>
                <md-option value="NFL">NFL</md-option>
                <md-option value="CFB">CFB</md-option>
                <md-option value="Other">Other</md-option>
            </md-select>
        </md-field>
        <md-button class="md-raised md-primary" @click="submitForm">
            Submit
        </md-button>
        <md-button to="/" class="md-accent">
            Home
        </md-button>
        <md-snackbar md-position="center" :md-duration="3" :md-active.sync="showSnackbar">
            <span>Success!</span>
        </md-snackbar>
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
                    total: '',
                    id: '',
                    homeTeamBettors: [],
                    awayTeamBettors: [],
                    overBettors: [],
                    underBettors: []
                },
                showSnackbar: false
            }
        },
        mounted () {
            if (this.$route.params.id) {
                this.form.id = this.$route.params.id;
                let eventData;
                let that = this;
                AXIOS
                    .get(`${process.env.VUE_APP_API_URL}/event/${this.$route.params.id}`)
                    .then(response => {
                        eventData = response.data;
                        that.form = eventData;
                    });
            }
        },
        methods: {
            submitForm: function(){
                if (!this.form.awayTeam || !this.form.homeTeam) {
                    return;
                }

                let that = this;
                if (!this.form.id || (this.form.id && this.form.date)) {
                    let dateTime = moment(this.form.date);
                    if (this.form.ampm === 'PM' && parseInt(this.form.hour) !== 12){
                        dateTime.hour(12+parseInt(this.form.hour));
                    }
                    else {
                        dateTime.hour(parseInt(this.form.hour));
                    }
                    dateTime.minute(this.form.minute);
                    this.form.dateTime = dateTime.toISOString();
                }

                AXIOS.put(`${process.env.VUE_APP_API_URL}/event`, this.form)
                    .then(function () {
                        //that.showSnackbar = true; //this is broken
                        that.form.awayTeam = '';
                        that.form.homeTeam = '';
                        that.form.line = '';
                        that.form.total = '';
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            },
        }
    }
</script>
<style lang="scss">
    .time-field {
        display: inline-block;
        margin-right: 10px;
        width: 30%;
    }
</style>