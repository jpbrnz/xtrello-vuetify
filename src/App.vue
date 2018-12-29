<template>
<v-app id="app">
  <v-navigation-drawer :clipped="drawer.clipped" :fixed="drawer.fixed" :permanent="drawer.permanent" :mini-variant="drawer.mini" v-model="drawer.open" app>
    <v-list>
      <v-list-tile v-if="$store.state.loggedIn" avatar>
        <v-list-tile-avatar v-cloak @click="toggleMiniDrawer">
          <img v-if="$store.state.member.avatarHash" v-bind:src="'https://trello-avatars.s3.amazonaws.com/' + $store.state.member.avatarHash +'/30.png'">
          <v-icon v-else>person</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{ $store.state.member.fullName }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
      <v-list-tile active-class="green--text" :to="{ path: '/home' }">
        <v-list-tile-action>
          <v-icon>home</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Home</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile v-if="$store.state.loggedIn" @click="createPDF">
        <v-list-tile-action>
          <v-icon>print</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Create PDF</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

    </v-list>
  </v-navigation-drawer>

  <v-toolbar :fixed="toolbar.fixed" color="grey lighten-5" :clipped-left="toolbar.clippedLeft" light fixed app>
    <v-toolbar-side-icon v-if="!drawer.open" @click.stop="toggleDrawer"></v-toolbar-side-icon>
    <v-btn small flat fab v-else>
      <v-icon @click.stop="toggleDrawer">close</v-icon>
    </v-btn>
    <v-spacer></v-spacer>
    <router-link :to="{ path: '/'}">
      <img v-if="$store.state.loggedIn" src="./assets/logo.png" class="align-center" style="width:100%;max-width:60px;height:auto;">
    </router-link>
  </v-toolbar>
  <v-content class="pt-2">
    <v-container fluid>
      <keep-alive include="Home" exlude="Boards,ModalAddCard">
        <router-view></router-view>
      </keep-alive>
    </v-container>
  </v-content>
  <v-footer app class="px-4">
    <span>BRNZPUB &copy; 2019</span>
  </v-footer>
</v-app>
</template>

<script>
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default {
  name: 'app',
  props: ['Trello'],
  data: function() {
    return {
      drawer: {
        // sets the open status of the drawer
        open: true,
        // sets if the drawer is shown above (false) or below (true) the toolbar
        clipped: true,
        // sets if the drawer is CSS positioned as 'fixed'
        fixed: false,
        // sets if the drawer remains visible all the time (true) or not (false)
        permanent: false,
        // sets the drawer to the mini variant, showing only icons, of itself (true)
        // or showing the full drawer (false)
        mini: true
      },
      toolbar: {
        //
        fixed: true,
        // sets if the toolbar contents is leaving space for drawer (false) or not (true)
        clippedLeft: true
      },
      footer: {
        // sets the CSS position of the footer
        fixed: true,
        // sets if the footer is full width (true) or gives space to the drawer (false)
        clippedLeft: true
      }
    }
  },
  methods: {
    // changes the drawer to permanent
    makeDrawerPermanent() {
      this.drawer.permanent = true
      // set the clipped state of the drawer and toolbar
      this.drawer.clipped = false
      this.toolbar.clippedLeft = false
    },
    // toggles the drawer variant (mini/full)
    toggleMiniDrawer() {
      this.drawer.mini = !this.drawer.mini
    },
    // toggles the drawer type (permanent vs temporary) or shows/hides the drawer
    toggleDrawer() {
      if (this.drawer.permanent) {
        this.drawer.permanent = !this.drawer.permanent
        // set the clipped state of the drawer and toolbar
        this.drawer.clipped = true
        this.toolbar.clippedLeft = true
      } else {
        // normal drawer
        this.drawer.open = !this.drawer.open
      }
    },
    createPDF() {
      html2canvas(document.getElementById("boardContainer"))
        .then(function(canvas) {
          var imgWidth = 210;
          var pageHeight = 295;
          var imgHeight = canvas.height * imgWidth / canvas.width;
          var heightLeft = imgHeight;
          var doc = new jsPDF('p', 'mm');
          var position = 0;

          var imgData = canvas.toDataURL('image/png');

          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
          doc.save('file.pdf');
        });
    }
  }
}
</script>

<style lang="scss">
[v-cloak] > * {
    display: none;
}
[v-cloak]::before {
    content: "loading...";
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
}

h1,
h2 {
    font-weight: normal;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    transition: color 1s ease;
    color: #28a745;
    &:hover {
        color: #1e7e34;
    }
}
img.rounded {
    border-radius: 50%;
    display: inline;
    width: 30px;
    height: 30px;
    margin: 5px 0 -10px;
}
</style>
