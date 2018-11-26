<template>
  <div>
    <div class="main-content-container">
      <span class="greeting">Hi, {{userName}}</span>&nbsp;
      <md-button type="button"
                 class="md-raised"
                 @click="showModalDialog">Change name</md-button>
      <md-tabs class="md-accent" md-alignment="centered">
        <md-tab id="tab-nfl" md-label="NFL" to="/nflTab"></md-tab>
        <md-tab id="tab-cfb" md-label="CFB" to="/cfbTab"></md-tab>
        <md-tab id="tab-other" md-label="Other" to="/otherTab"></md-tab>
      </md-tabs>
      <bet-table :event-array="nflEvents" event-type="NFL" :user-name="userName" :dialog="dialog"
                 v-on:add-bettor-to-event="addBettorToEvent" :is-admin="isAdmin"
                 v-on:remove-event="removeEvent"
                 v-show="tabToShow === 'nflTab'"
                 :is-loading="isLoadingNFL"
      ></bet-table>
      <bet-table :event-array="cfbEvents" event-type="CFB" :user-name="userName" :dialog="dialog"
                 v-on:add-bettor-to-event="addBettorToEvent" :is-admin="isAdmin"
                 v-on:remove-event="removeEvent"
                 v-show="tabToShow === 'cfbTab'"
                 :is-loading="isLoadingCFB"
      ></bet-table>
      <bet-table :event-array="otherEvents" event-type="Other" :user-name="userName" :dialog="dialog"
                 v-on:add-bettor-to-event="addBettorToEvent" :is-admin="isAdmin"
                 v-on:remove-event="removeEvent"
                 v-show="tabToShow === 'otherTab'"
                 :is-loading="isLoadingOther"
      ></bet-table>
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

    <div class="phone-viewport">
      <md-bottom-bar>
        <md-bottom-bar-item @click="copyBets" md-label="Copy Bets to Clipboard" md-icon="file_copy"></md-bottom-bar-item>
      </md-bottom-bar>
    </div>
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
            isAdmin: false,
            tabToShow: 'nflTab',
            isLoadingNFL: true,
            isLoadingCFB: true,
            isLoadingOther: true,
            textToCopy: ''
        }
    },
    mounted () {
        AXIOS
            .get(`${process.env.VUE_APP_API_URL}/events?type=NFL`)
            .then(response => {
                this.nflEvents = response.data;
                this.isLoadingNFL = false;
            });

        AXIOS
            .get(`${process.env.VUE_APP_API_URL}/events?type=CFB`)
            .then(response => {
                this.cfbEvents = response.data;
                this.isLoadingCFB = false;
            });

        AXIOS
            .get(`${process.env.VUE_APP_API_URL}/events?type=Other`)
            .then(response => {
                this.otherEvents = response.data;
                this.isLoadingOther = false;
            });

        this.isAdmin = this.$route.query.isAdmin;

        if (this.$route.name) {
            this.tabToShow = this.$route.name;
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
      },
      copyBets: function(){
          let stringToCopyArray = [];
          let userName = this.userName;
          let eventsToCopy = this.nflEvents;

          if (this.tabToShow === 'cfbTab') {
              eventsToCopy = this.cfbEvents;
          }
          else if (this.tabToShow === 'otherTab'){
              eventsToCopy = this.otherEvents;
          }

          _.forEach(eventsToCopy, function(betEvent){
              if (_.includes(betEvent.homeTeamBettors, userName)){
                  stringToCopyArray.push(`${betEvent.homeTeam} ${-betEvent.line} vs ${betEvent.awayTeam} `);
              }
              if (_.includes(betEvent.awayTeamBettors, userName)){
                  stringToCopyArray.push(`${betEvent.awayTeam} ${betEvent.line} at ${betEvent.homeTeam} `);
              }
              if (_.includes(betEvent.overBettors, userName)){
                  stringToCopyArray.push(`${betEvent.awayTeam} at ${betEvent.homeTeam}: over ${betEvent.total}`);
              }
              if (_.includes(betEvent.underBettors, userName)){
                  stringToCopyArray.push(`${betEvent.awayTeam} at ${betEvent.homeTeam}: under ${betEvent.total}`);
              }
          });

          let stringToCopy = _.join(stringToCopyArray, '\r\n');
          let that = this;
          this.$copyText(stringToCopy).then(function () {
              that.$toasted.show('Copied to clipboard', {
                  position: 'bottom-center',
              }).goAway(2500);
          }, function () {
              that.$toasted.show('Error copying to clipboard', {
                  position: 'bottom-center',
              }).goAway(2500);
          })
      }
    },
    watch: {
        userName(newName) {
            localStorage.userName = newName;
        },
        $route (to){
            this.tabToShow = to.name;
        }
    }
  }
</script>

<style lang="scss">
  .main-content-container {
    padding-bottom: 56px;
  }

  .greeting {
    top: 15px;
    position: relative;
  }

  .phone-viewport {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 500;

    .md-bottom-bar {
      .md-ripple {
        justify-content: center;
      }
    }
  }

  .hidden-textarea {
    display: none;
  }
</style>
