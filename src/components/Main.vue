<template>
  <div>
    <span>Hi, {{userName}}</span>&nbsp;
    <button type="button"
       class="mdl-button mdl-js-button mdl-button--raised"
       @click="showModalDialog">Change name</button>
    <div class="mdl-tabs mdl-js-tabs">
      <div class="mdl-tabs__tab-bar">
        <a href="#nflTab" id="nflTabLink" class="mdl-tabs__tab">NFL</a>
        <a href="#cfbTab" id="cfbTabLink" ref="cfbTab" class="mdl-tabs__tab">CFB</a>
        <a href="#otherTab" id="otherTabLink" class="mdl-tabs__tab">Other</a>
      </div>
      <div class="mdl-tabs__panel is-active" id="nflTab">
        <bet-table :event-array="nflEvents" event-type="NFL" :user-name="userName" :dialog="dialog"
                   v-on:add-bettor-to-event="addBettorToEvent" :is-admin="isAdmin"
                    v-on:remove-event="removeEvent"></bet-table>
      </div>
      <div id="cfbTab" class="mdl-tabs__panel">
        <bet-table :event-array="cfbEvents" event-type="CFB" :user-name="userName" :dialog="dialog"
                   v-on:add-bettor-to-event="addBettorToEvent" :is-admin="isAdmin"
                    v-on:remove-event="removeEvent"></bet-table>
      </div>
      <div id="otherTab" class="mdl-tabs__panel">

      </div>

    </div>
    <dialog class="mdl-dialog">
      <h4 class="mdl-dialog__title">What is your name?</h4>
      <div class="mdl-dialog__content">
        <input v-model="userName" placeholder="edit me">
      </div>
      <div class="mdl-dialog__actions">
        <button type="button"
                class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                @click="closeDialog" :disabled="!userName">Confirm</button>
        <button type="button" class="mdl-button close mdl-js-button"
                @click="closeDialog">I'm just looking</button>
      </div>
    </dialog>
  </div>
</template>

<script>
  import {AXIOS} from '../config/http-commons';
  import BetTable from './BetTable.vue'
  import dialogPolyfill from 'dialog-polyfill';
  import _ from 'lodash';

  export default {
    name: 'Main',
    components: { BetTable },
    props: {
      title: String,
      vmaLinks: Array,
      mdcLinks: Array
    },
    data () {
        return {
            nflEvents: [],
            cfbEvents: [],
            otherEvents: [],
            userName: '',
            dialog: null,
            isAdmin: false
        }
    },
    mounted () {
        AXIOS
            .get(`${process.env.VUE_APP_API_URL}/events?type=NFL`)
            .then(response => (this.nflEvents = response.data));

        AXIOS
            .get(`${process.env.VUE_APP_API_URL}/events?type=CFB`)
            .then(response => (this.cfbEvents = response.data));

        this.isAdmin = this.$route.query.isAdmin;
        console.log('route', this.$route);
        if (_.includes(this.$route.path, 'cfbTab')){
            this.$refs.cfbTab.click();
        }

        this.dialog = document.querySelector('dialog');
        dialogPolyfill.registerDialog(this.dialog);

        if (localStorage.userName) {
            this.userName = localStorage.userName;
        }
        else {
            this.dialog.showModal();
        }
    },
    methods: {
      closeDialog: function() {
          this.dialog.close();
      },
      addBettorToEvent: function (betType, betEvent) {
          if (!this.userName){
              this.dialog.showModal();
          }
          else {
              if (betType === 'home'){
                  if (!betEvent.homeTeamBettors.includes(this.userName)){
                      let userName = this.userName;
                      AXIOS.post(`${process.env.VUE_APP_API_URL}/event/${betEvent.id}/home`, {
                          name: userName
                      })
                          .then(function () {
                              betEvent.homeTeamBettors.push(userName);
                          })
                          .catch(function (error) {
                              console.error(error);
                          });
                  }
              }
              else if (betType === 'away') {
                  if (!betEvent.awayTeamBettors.includes(this.userName)){
                      let userName = this.userName;
                      AXIOS.post(`${process.env.VUE_APP_API_URL}/event/${betEvent.id}/away`, {
                          name: userName
                      })
                          .then(function () {
                              betEvent.awayTeamBettors.push(userName);
                          })
                          .catch(function (error) {
                              console.error(error);
                          });
                  }
              }
              else if (betType === 'over') {
                  if (!betEvent.overBettors.includes(this.userName)){
                      let userName = this.userName;
                      AXIOS.post(`${process.env.VUE_APP_API_URL}/event/${betEvent.id}/over`, {
                          name: userName
                      })
                          .then(function () {
                              betEvent.overBettors.push(userName);
                          })
                          .catch(function (error) {
                              console.error(error);
                          });
                  }
              }
              else if (betType === 'under') {
                  if (!betEvent.underBettors.includes(this.userName)){
                      let userName = this.userName;
                      AXIOS.post(`${process.env.VUE_APP_API_URL}/event/${betEvent.id}/under`, {
                          name: userName
                      })
                          .then(function () {
                              betEvent.underBettors.push(userName);
                          })
                          .catch(function (error) {
                              console.error(error);
                          });
                  }
              }
          }

      },
      showModalDialog: function(){
          this.dialog.showModal();
      },
      removeEvent: function(id, eventType){
          let that = this;
          AXIOS.delete(`${process.env.VUE_APP_API_URL}/event/${id}`)
              .then(function () {
                  if (eventType === 'NFL'){
                      that.nflEvents = that.nflEvents.filter(event => event.id !== id);
                  }
                  else if (eventType === 'CFB'){
                      that.cfbEvents = that.cfbEvents.filter(event => event.id !== id);
                  }
                  else {
                      that.otherEvents = that.otherEvents.filter(event => event.id !== id);
                  }
              })
              .catch(function (error) {
                  console.error(error);
              });
      }
    },
    watch: {
        userName(newName) {
            localStorage.userName = newName;
        }
    }
  }
</script>

<style lang="scss">
</style>
