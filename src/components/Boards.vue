<template>
<div v-if="$store.state.loggedIn">
  <div class="board-header">
    <v-container grid-list-md fluid>
      <v-layout row wrap justify-center>
        <v-flex xs9 md4>
          <v-autocomplete outline color="green" v-model="selected" :items="$store.state.boards" label="Select a board" item-text="name" item-value="id" :filter="customFilter" v-on:change="loadLists(selected.value)">
            <template slot="selection" slot-scope="data">
                {{ data.item.text }}
              </template>
            <template slot="item" slot-scope="data">
                <template>
                  <v-list-tile-content v-text="data.item.text"></v-list-tile-content>
                </template>
            </template>
          </v-autocomplete>
        </v-flex>
        <v-flex xs2 md1>
          <div class="board-toggler">
            <v-menu transition="scale-transition" v-model="menu" :close-on-content-click="false" :nudge-width="150">
              <v-btn fab box small slot="activator" color="green lighten-3" class="green--text text--darken-3">
                <v-icon>filter_list</v-icon>
              </v-btn>

              <v-card>
                <v-card-actions>
                  <h3 class="px-2">Visible on Cards</h3>
                  <v-spacer></v-spacer>

                  <v-btn fab flat small @click="menu = false">
                    <v-icon>close</v-icon>
                  </v-btn>
                </v-card-actions>
                <v-list>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-switch color="green lighten-3" label="Labels" v-model="showLabels"></v-switch>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-switch color="green lighten-3" label="Due dates" v-model="showDue"></v-switch>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-switch color="green lighten-3" label="Comments" v-model="showComments"></v-switch>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-switch color="green lighten-3" label="Descriptions" v-model="showDescription"></v-switch>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-switch color="green lighten-3" label="Members" v-model="showMembers"></v-switch>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-menu>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
    <div id="boardContainer" class="board">
      <v-expansion-panel popout>
        <v-expansion-panel-content v-for="list in $store.state.lists" :key="list.name" class="list">
          <div slot="header">
            <strong>{{ list.name }}</strong>
            <v-icon class="hidden-xs-only">arrow_right</v-icon>
            <v-chip label color="grey lighten-4">
              <v-avatar tile class="grey lighten-2">{{list['cards'].length}}</v-avatar>
              Cards
            </v-chip>
            <modaladdcard :listId="list.id" v-on:card-created="createdCard(selected.value)"></modaladdcard>
          </div>
          <v-card>
            <v-card-text>
              <v-container grid-list-md fluid>
                <v-layout row wrap>
                  <v-flex xs12 class="mt-3" v-for="card in list['cards']" :key="card.id">
                    <v-card class="grey lighten-5 px-2 elevation-2">
                      <v-card-text class="px-2">
                        <div v-if="showLabels" v-for="label in card['labels']" :key="label.name" class="card-labels">
                          <div v-bind:style="{ 'background-color': $store.state.labelColor[label.color], 'color':'#fff' } " class="card-label-object badge badge-pill">
                            {{ label.name }}
                          </div>
                        </div>
                        <h2>{{ card.name }}</h2>
                        <hr>
                        <div v-if="showDescription">
                          <div class="subhead font-weight-black grey--text">Details:</div>
                          <vue-markdown>{{ card.desc }}</vue-markdown>
                        </div>
                        <div v-if="showMembers">
                          <div v-if="card.members[0]" class="members-box">
                            <div class="subhead font-weight-black grey--text">Members:</div>
                            <div style="display:inline;" v-for="member in card['members']" :key="member.id">
                              <v-tooltip top>
                                <v-btn v-if="!member.avatarHash" slot="activator" color="grey" fab outline small>
                                  {{ member.initials }}
                                </v-btn>
                                <v-btn v-else slot="activator" color="grey lighten-2" fab small>
                                  <img style="border-radius: 50%;" v-bind:src="'https://trello-avatars.s3.amazonaws.com/' + member.avatarHash +'/30.png'">
                                </v-btn>
                                <span>{{ member.fullName }}</span>
                              </v-tooltip>
                            </div>
                          </div>
                        </div>
                        <div v-if="showDue" class="mt-2 mb-2">
                          <v-chip outline v-if="card.due" label color="green">
                            <div variant="success">Card Due: {{card.due | formatDueDate}}</div>
                          </v-chip>
                        </div>
                        <div v-if="showComments">
                          <div v-if="card.comments[0]" class="card-comment-box">
                            <div class="subhead font-weight-black grey--text">Comments:</div>
                            <div v-for="comment in card['comments']" :key="comment.data.text" class="card-comment">
                              <div class="subhead mt-4 mb-0">
                                <v-badge color="transparent">
                                  <v-icon slot="badge" small>chat</v-icon>
                                  <span><strong>{{ comment.memberCreator.fullName }}</strong></span>
                                </v-badge>
                              </div>
                              <v-card color="evoth ml-4 px-4 py-4">
                                <v-card-text>
                                  <vue-markdown>{{ comment.data.text }}</vue-markdown>
                                  <p class="small"><strong><em> Commented on <span aria-hidden="true" class="ei ei-icon_clock_alt"></span> {{ comment.date | formatDate }}</em></strong></p>
                                </v-card-text>
                              </v-card>
                            </div>
                          </div>
                        </div>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="green" :title="card.shortUrl" v-bind:href="card.shortUrl">
                          View on Trello
                          <v-icon>launch</v-icon>
                        </v-btn>
                        <small class="float-right mt-2"></small>
                      </v-card-actions>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </div>

  </div>
  <v-snackbar v-model="snackbar" :color="color" :multi-line="mode === 'multi-line'" :timeout="timeout" :vertical="mode === 'vertical'">
    {{ text }}
    <v-btn dark flat @click="snackbar = false">
      Close
    </v-btn>
  </v-snackbar>
</div>
</template>

<script>
import Vue from 'vue'
import VueMarkdown from 'vue-markdown'
import moment from 'moment'
import modaladdcard from './ModalAddCard.vue'

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY hh:mm a')
  }
});

Vue.filter('formatDueDate', function(value) {
  if (value) {
    return moment(String(value)).format('MMM Do, YYYY hh:mm a')
  }
});

export default {
  name: 'Boards',

  components: {
    VueMarkdown,
    modaladdcard
  },

  data: function() {
    return {
      snackbar: false,
      color: '',
      mode: '',
      timeout: 2000,
      text: 'Success!! Card created',
      menu: false,
      memberMenu: false,
      selected: '-- Select a board --',
      anchor: '#',
      showLabels: true,
      showComments: true,
      showDescription: true,
      showDue: true,
      showMembers: true
    }

  },

  methods: {
    customFilter(item, queryText, itemText) {
      const textOne = item.text.toLowerCase();
      const textTwo = item.value;
      const searchText = queryText.toLowerCase();

      return textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1
    },
    createdCard: function(boardId) {
      //console.log('Dispatching loadLists with id: ' + boardId)
      this.$store.dispatch('loadLists', boardId)
      this.snackbar = true
    },

    loadLists: function(boardId) {
      //console.log('Dispatching loadLists with id: ' + boardId)
      this.$store.dispatch('loadLists', boardId)

    }

  }
}
</script>
<style lang="scss">
.theme--light.v-icon {
    color: rgba(0,0,0,1);
}
.v-expansion-panel__header {
    font-size: 18px;
    @media only screen and (max-width: 600px) {
        font-size: 14px;
    }
}
.card-comment:nth-child(odd) > .evoth {
    background-color: #EEEEEE!important;
    border-color: #EEEEEE!important;
}
.card-comment:nth-child(even) > .evoth {
    background-color: #E0E0E0!important;
    border-color: #E0E0E0!important;
}
.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
    display: none;
}
.card.nobo {
    text-align: left;
    border: none;
}
h2 {
    text-shadow: 1px 1px 1px #9CC18A!important;
    text-shadow: 1px 1px 1px rgba(156,193,138,0.8)!important;
    padding: 10px 0;
}
hr {
    margin: 5px 0 15px;
}
.card-comment {
    .v-card {
        border-radius: 10px;
    }
}
.v-expansion-panel__body {
    .v-card__text {
        padding: 0 16px 16px;
        width: 100%;
    }
    .container {
        padding: 0 24px;
    }
}
</style>
