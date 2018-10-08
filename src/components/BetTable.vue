<template>

    <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
        <thead>
        <tr>
            <th>Team</th>
            <th>Line</th>
            <th>O/U</th>
        </tr>
        </thead>
        <tbody>
        <template v-for="betEvent in eventArray">
            <tr class="bet-date-row">
                <td colspan="3">{{betEvent.dateTime | displayDate}}</td>
            </tr>
            <tr>
                <td>{{betEvent.awayTeam}}
                    <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored"
                            @click="$emit('add-bettor-to-event', 'away', betEvent)">
                        <i class="material-icons">add</i>
                    </button>
                </td>
                <td>{{betEvent.line}}</td>
                <td>O {{betEvent.total}}
                    <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored"
                            @click="$emit('add-bettor-to-event', 'over', betEvent)">
                        <i class="material-icons">add</i>
                    </button>
                </td>
            </tr>
            <tr>
                <td>{{betEvent.homeTeam}}
                    <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored"
                            @click="$emit('add-bettor-to-event', 'home', betEvent)">
                        <i class="material-icons">add</i>
                    </button>
                </td>
                <td>{{betEvent.line | reverseLine}}</td>
                <td>U {{betEvent.total}}
                    <button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored"
                            @click="$emit('add-bettor-to-event', 'under', betEvent)">
                        <i class="material-icons">add</i>
                    </button>
                </td>
            </tr>
            <tr v-if="areThereAnyBettors(betEvent)">
                <td colspan="3">
                    <span v-if="betEvent.awayTeamBettors.length">{{betEvent.awayTeam}}: </span>
                    <span v-for="bettor in betEvent.awayTeamBettors">
                            {{ bettor }} <i class="material-icons remove-icon"
                                            @click="removeBettorFromEvent(betEvent.id, 'away', eventType, bettor)">clear</i>
                    </span>
                    <br v-if="shouldBreakAfterAway(betEvent)"/>
                    <span v-if="betEvent.homeTeamBettors.length">{{betEvent.homeTeam}}: </span>
                    <span v-for="bettor in betEvent.homeTeamBettors">
                            {{ bettor }} <i class="material-icons remove-icon"
                                            @click="removeBettorFromEvent(betEvent.id, 'home', eventType, bettor)">clear</i>
                    </span>
                    <br v-if="shouldBreakAfterHome(betEvent)"/>
                    <span v-if="betEvent.overBettors.length">Over {{betEvent.total}}: </span>
                    <span v-for="bettor in betEvent.overBettors">
                            {{ bettor }} <i class="material-icons remove-icon"
                                            @click="removeBettorFromEvent(betEvent.id, 'over', eventType, bettor)">clear</i>
                    </span>
                    <br v-if="shouldBreakAfterOver(betEvent)"/>
                    <span v-if="betEvent.underBettors.length">Under {{betEvent.total}}: </span>
                    <span v-for="bettor in betEvent.underBettors">
                            {{ bettor }} <i class="material-icons remove-icon"
                                            @click="removeBettorFromEvent(betEvent.id, 'under', eventType, bettor)">clear</i>
                    </span>
                </td>

            </tr>
        </template>

        </tbody>

    </table>
</template>

<script>
    import {AXIOS} from '../config/http-commons';
    import moment from 'moment';
    import _ from 'lodash';

    export default {
        name: 'BetTable',
        props: {
            eventType: String,
            eventArray: Array,
            userName: String,
            dialog: HTMLDialogElement,
            testParentCallback: Function
        },
        filters: {
            displayDate: function (date) {
                return moment(date).format('ddd MMM D h:mm a');
            },
            reverseLine: function (line) {
                return -parseFloat(line);
            }
        },
        methods: {
            removeBettorFromEvent: function (id, betType, eventType, bettor) {

                let event = this.eventArray.find(function (ev) {
                    return ev.id === id;
                });
                if (betType === 'home') {
                    let userName = this.userName;
                    AXIOS.delete(`${process.env.VUE_APP_API_URL}/event/${id}/home?name=${bettor}`, {
                        name: userName
                    })
                        .then(function () {
                            event.homeTeamBettors = event.homeTeamBettors.filter(name => name !== bettor);
                        })
                        .catch(function (error) {
                            console.error(error);
                        });
                }
                else if (betType === 'away') {
                    let userName = this.userName;
                    AXIOS.delete(`${process.env.VUE_APP_API_URL}/event/${id}/away?name=${bettor}`, {
                        name: userName
                    })
                        .then(function () {
                            event.awayTeamBettors = event.awayTeamBettors.filter(name => name !== bettor);
                        })
                        .catch(function (error) {
                            console.error(error);
                        });
                }
                else if (betType === 'over') {
                    let userName = this.userName;
                    AXIOS.delete(`${process.env.VUE_APP_API_URL}/event/${id}/over?name=${bettor}`, {
                        name: userName
                    })
                        .then(function () {
                            event.overBettors = event.overBettors.filter(name => name !== bettor);
                        })
                        .catch(function (error) {
                            console.error(error);
                        });
                }
                else if (betType === 'under') {
                    let userName = this.userName;
                    AXIOS.delete(`${process.env.VUE_APP_API_URL}/event/${id}/under?name=${bettor}`, {
                        name: userName
                    })
                        .then(function () {
                            event.underBettors = event.underBettors.filter(name => name !== bettor);
                        })
                        .catch(function (error) {
                            console.error(error);
                        });
                }
            },
            areThereAnyBettors: function (betEvent) {
                return (_.size(betEvent.homeTeamBettors)
                    || _.size(betEvent.awayTeamBettors)
                    || _.size(betEvent.overBettors)
                    || _.size(betEvent.underBettors))
            },
            shouldBreakAfterAway: function (betEvent) {
                return _.size(betEvent.awayTeamBettors) && (
                    _.size(betEvent.homeTeamBettors)
                    || _.size(betEvent.overBettors)
                    || _.size(betEvent.underBettors)
                );
            },
            shouldBreakAfterHome: function (betEvent) {
                return _.size(betEvent.homeTeamBettors) && (
                    _.size(betEvent.overBettors)
                    || _.size(betEvent.underBettors)
                );
            },
            shouldBreakAfterOver: function (betEvent) {
                return _.size(betEvent.overBettors) && _.size(betEvent.underBettors);
            }
        }
    }
</script>
<style lang="scss">
    .mdl-data-table tbody tr.bet-date-row {
        background-color: #ccc;
        height: 24px;

        td {
            text-align: center;
        }
    }

    .remove-icon {
        cursor: pointer;
    }
</style>