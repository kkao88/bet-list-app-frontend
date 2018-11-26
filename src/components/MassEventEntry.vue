<template>
    <div>
        <div>
            <label>Date</label>
            <datepicker v-model="date" name="date"></datepicker>
        </div><br />
        <md-field>
            <label class="" for="event-type">Event Type</label>
            <md-select v-model="type" id="event-type" required>
                <md-option value="NFL">NFL</md-option>
                <md-option value="CFB">CFB</md-option>
                <md-option value="Other">Other</md-option>
            </md-select>
        </md-field>
        <md-field>
            <label>Enter text here:</label>
            <md-textarea v-model="text" md-autogrow></md-textarea>
        </md-field>
        <md-button class="md-raised md-primary" @click="submitForm">
            Submit
        </md-button>
        <md-button to="/" class="md-accent">
            Home
        </md-button>
    </div>
</template>
<script>
    import {AXIOS} from '../config/http-commons';
    import moment from 'moment';
    import Datepicker from 'vuejs-datepicker';

    export default {
        name: 'MassEventEntry',
        components: {Datepicker},
        data: () => ({
            type: 'NFL',
            text: '',
            date: ''
        }),
        methods: {
            submitForm: function(){
                if (!this.text) {
                    return;
                }

                let that = this;

                AXIOS.post(`${process.env.VUE_APP_API_URL}/massEntry/${that.type}?date=${moment(that.date).format('MM DD YYYY')}`, that.text)
                    .then(function () {
                        that.text = '';
                        that.$toasted.show('Submitted', {
                            position: 'bottom-center',
                        }).goAway(2500);
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            }
        }
    }
</script>