<template>
<v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
  <v-chip label slot="activator" color="grey lighten-4" class="green--text">
    <v-avatar tile class="green lighten-4">
      <v-icon color="green">add</v-icon>
    </v-avatar>
    <strong>Card</strong>
  </v-chip>

  <v-card>
    <v-toolbar light>
      <v-btn icon light @click="dialog = false">
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>Create card</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <form>
        <p class="notValid" v-if="errors.length">
          <b class="text-center">Oops!! You might want to fix:</b>
          <ul>
            <li v-for="error in errors"><span class="ei ei-error-oct_alt"></span>{{ error }}</li>
          </ul>
        </p>
        <v-text-field color="green darken-4" v-model="cardtitled" label="Title" required></v-text-field>
        <v-textarea color="green darken-4" v-model="cardcontent" label="Enter request details" hint="Please provide as much detail as possible"></v-textarea>
        <v-text-field color="green darken-4" v-model="cardURL" label="Enter a referene URL" required></v-text-field>
        <v-btn color="green darken-2" class="white--text" @click="onCreate">Create Card</v-btn>
        <v-btn @click="clear">Cancel</v-btn>
      </form>
    </v-card-text>
  </v-card>
</v-dialog>
</template>
<script>
export default {
  name: 'modaladdcard',
  props: ['listId'],
  data() {
    return {
      errors: [],
      cardtitled: "",
      cardcontent: "",
      cardURL: "",
      dialog: false
    };
  },

  methods: {
    clear() {
      this.cardtitled = ''
      this.cardcontent = ''
      this.cardURL = ''
      this.dialog = false
    },
    checkForm: function() {
      this.errors = [];

      if (!this.cardtitled) {
        this.errors.push("\nTitle is missing");
      }
      if (!this.cardcontent) {
        this.errors.push('\nContent is missing');
      }

      if (!this.errors.length) {
        return true;
      }
    },
    /**
     * onCreate - proceed to new card creation
     */
    onCreate() {
      if (!this.checkForm()) {
        return false;
      }

      let newCard = {
        name: this.cardtitled,
        desc: '\n**Initiator:** ' + this.$store.state.member.fullName + '\n\n**Description:** ' + this.cardcontent + '\n\n**Ref URL:** ' + this.cardURL,
        pos: 'top',
        due: new Date().setDate(new Date().getDate() + 7),
        idList: this.listId,
        idMembers: this.$store.state.member.id
      };

      Trello.post('/cards/', newCard, this.onSuccessAddCard, this.onErrorAddCard);
      this.dialog = false;

    },

    /**
     * onSuccessAddCard - adding card
     * @param  Object added card
     */
    onSuccessAddCard(response) {
      this.$emit('card-created', response)
      this.cardtitled = ""
      this.cardcontent = ""
      //alert('Card created')
    },

    /**
     * onErrorAddCard - an error occured during adding
     * @param  {[type]} error [description]
     * @return {[type]}       [description]
     */
    onErrorAddCard(error) {
      console.error(error)
    }
  }
}
</script>
<style lang="scss">
.notValid {
    padding: 4px;
    color: #dc3545;
    border: 1px solid #dc3545;
    background: #fbeaec;
}
</style>
