<template>
    <div>
        <md-switch v-model="displayOnlyGamesWithBettors" class="display-switch">
            Display only games with Bettors</md-switch>
        <br v-if="isLoading" />
        <img src="../assets/Spinner-1s-200px.gif" v-if="isLoading">
        <p v-if="!isLoading && !eventArray.length">There are no games to display</p>
        <md-table v-if="eventArray.length">
            <thead>
            <md-table-row>
                <md-table-head>Team</md-table-head>
                <md-table-head>Line</md-table-head>
                <md-table-head>O/U</md-table-head>
            </md-table-row>
            </thead>
            <tbody>
            <template v-for="betEvent in eventArray" v-if="shouldShowEvent(betEvent)">
                <md-table-row class="bet-date-row">
                    <md-table-cell colspan="3">
                        {{betEvent.dateTime | displayDate}}
                        <span class="remove-event-button" v-if="isAdmin" @click="$emit('remove-event', betEvent.id, eventType)">
                            <i class="material-icons remove-icon"
                            >clear</i>
                        </span>
                        <router-link v-if="isAdmin" :to="`/edit/${betEvent.id}`">Edit</router-link>
                    </md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell class="team-table-cell">
                        <md-button class="md-icon-button md-dense md-raised md-primary"
                                   @click="$emit('add-bettor-to-event', 'away', betEvent)">
                            <md-icon>add</md-icon>
                        </md-button>
                        <span class="table-text-display">{{betEvent.awayTeam}}</span>
                    </md-table-cell>
                    <md-table-cell>{{betEvent.line}}</md-table-cell>
                    <md-table-cell class="team-table-cell">
                        <span class="table-text-display">O {{betEvent.total}}</span>
                        <md-button  v-if="betEvent.total" class="md-icon-button md-dense md-raised md-primary"
                                    @click="$emit('add-bettor-to-event', 'over', betEvent)">
                            <md-icon>add</md-icon>
                        </md-button>
                    </md-table-cell>
                </md-table-row>
                <md-table-row>
                    <md-table-cell class="team-table-cell">
                        <md-button class="md-icon-button md-dense md-raised md-primary"
                                   @click="$emit('add-bettor-to-event', 'home', betEvent)">
                            <md-icon>add</md-icon>
                        </md-button>
                        <span class="table-text-display">{{betEvent.homeTeam}}</span>
                    </md-table-cell>
                    <md-table-cell>{{betEvent.line | reverseLine}}</md-table-cell>
                    <md-table-cell class="team-table-cell">
                        <span class="table-text-display">U {{betEvent.total}}</span>
                        <md-button  v-if="betEvent.total" class="md-icon-button md-dense md-raised md-primary"
                                    @click="$emit('add-bettor-to-event', 'under', betEvent)">
                            <md-icon>add</md-icon>
                        </md-button>
                    </md-table-cell>
                </md-table-row>
                <md-table-row v-if="areThereAnyBettors(betEvent)">
                    <md-table-cell colspan="3">
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
                    </md-table-cell>

                </md-table-row>
            </template>

            </tbody>

        </md-table>
    </div>
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
            dialog: null, //HTMLDialogElement
            testParentCallback: Function,
            isAdmin: null,
            isLoading: Boolean
        },
        data: () => ({
            displayOnlyGamesWithBettors: false
        }),
        filters: {
            displayDate: function (date) {
                return moment(date).format('ddd MMM D h:mm a');
            },
            reverseLine: function (line) {
                let reversed = -parseFloat(line);
                return reversed > 0 ? '+'+reversed : reversed;
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
            },
            shouldShowEvent: function (betEvent) {
                if (!this.displayOnlyGamesWithBettors){
                    return true;
                }
                else {
                    return this.areThereAnyBettors(betEvent);
                }
            }
        }
    }
</script>
<style lang="scss">
    tr.bet-date-row {
        background-color: #ccc;

        td {
            text-align: center;
        }
    }

    .team-table-cell {
        .md-table-cell-container {
            display: flex;

            .table-text-display {
                display: inline-flex;
                align-items: center;
            }
        }
    }

    .remove-icon {
        cursor: pointer;
    }

    .remove-event-button {
        clear:both;
        float: right;
    }

    .display-switch {
        margin-left: 15px;
    }
</style>