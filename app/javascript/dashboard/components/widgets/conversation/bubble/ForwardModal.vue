<template>
  <woot-modal modal-type="right-aligned" show :on-close="onClose">
    <div class="fixed inset-y-0 right-0 max-h-screen overflow-auto bg-white shadow-md modal-container rtl:text-right dark:bg-slate-900 skip-context-menu rounded-xl w-[50rem] z-50">
      <!-- Header -->
      <div class="px-6 py-3 border-b border-slate-200 dark:border-slate-800">
        <h1 class="text-lg font-semibold text-slate-900 dark:text-white">
          Compartilhar mensagem
        </h1>
        <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Compartilhe a mensagem com seus contatos
        </p>
      </div>

      <!-- Search -->
      <div class="px-6 py-3 border-b border-slate-200 dark:border-slate-800">
        <label class="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Procurar um contato
        </label>
        <input
          type="search"
          class="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md
                 focus:outline-none focus:ring-2 focus:ring-woot-500/20 focus:border-woot-500
                 bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                 hover:border-woot-500 transition-colors"
          v-model="searchQuery"
          @input="onInputSearch"
          @search="resetSearch"
          placeholder="Buscar por nome ou telefone"
        >
      </div>

      <!-- Contacts List -->
      <form @submit.prevent="onSubmit" class="flex-1 flex flex-col min-h-0">
        <!-- Table Header -->
        <div class="px-6 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div class="flex items-center text-xs font-medium text-slate-700 dark:text-slate-300">
            <div class="w-6"></div>
            <div class="flex-1 min-w-[150px]">Contato</div>
            <div class="w-36">Telefone</div>
          </div>
        </div>

        <!-- Table Body -->
        <div class="flex-1 overflow-y-auto min-h-0">
          <div class="divide-y divide-slate-200 dark:divide-slate-700">
            <div
              v-for="contact in contacts"
              :key="contact.id"
              class="flex items-center px-6 py-2 hover:bg-slate-800/5 dark:hover:bg-slate-800"
            >
              <div class="w-6">
                <input
                  type="checkbox"
                  :value="contact.id"
                  name="contactIds[]"
                  class="w-4 h-4 rounded border-slate-300 dark:border-slate-600
                         text-woot-500 focus:ring-woot-500/20"
                >
              </div>
              <div class="flex-1 min-w-[150px] flex items-center">
                <div v-if="contact.thumbnail" class="w-6 h-6 mr-2">
                  <img
                    :src="contact.thumbnail"
                    :alt="contact.name"
                    class="w-full h-full rounded-full object-cover"
                  >
                </div>
                <span class="truncate text-xs">{{ contact.name }}</span>
              </div>
              <div class="w-36 truncate text-xs tracking-tight">{{ contact.phone_number }}</div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <woot-button
            :disabled="showEmptySearchResult"
            class="bg-woot-500 hover:bg-woot-600 text-white text-sm px-4 py-1.5"
          >
            Encaminhar
          </woot-button>
        </div>
      </form>
    </div>
  </woot-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { useAlert } from 'dashboard/composables';
import TimeAgo from 'dashboard/components/ui/TimeAgo';
import debounce from 'lodash/debounce';

const DEFAULT_PAGE = 1;
export default {
  components: {
      TimeAgo,
  },
  props: {
      message: {
          type: Object
      }
  },
  data() {
      return {
          searchQuery: '',
      }
  },
  computed: {
      ...mapGetters({
          contacts: 'contacts/getContacts',
      }),
      showEmptySearchResult() {
          return !!this.searchQuery && this.contacts.length === 0;
      },
  },
  mounted() {
      this.fetchContacts(DEFAULT_PAGE);
  },
  methods: {
      onClose() {
          this.$emit('close');
      },
      updatePageParam(page) {
          window.history.pushState({}, null, `${this.$route.path}?page=${page}`);
      },
      fetchContacts(page) {
          this.updatePageParam(page);
          let value = this.searchQuery;
          if (this.searchQuery.charAt(0) === '+') {
              value = this.searchQuery.substring(1);
          }
          const requestParams = {
              page,
              sortAttr: '-last_activity_at',
          };
          if (!value) {
              this.$store.dispatch('contacts/get', requestParams);
          } else {
              this.$store.dispatch('contacts/search', {
                  search: encodeURIComponent(value),
                  ...requestParams,
              });
          }
      },
      onSearchSubmit() {
          if (!this.searchQuery) return;
          this.fetchContacts(DEFAULT_PAGE);
      },
      onInputSearch: debounce(function(event) {
          const newQuery = event.target.value;
          this.searchQuery = newQuery;
          this.fetchContacts(DEFAULT_PAGE);
      }, 300),
      resetSearch(event) {
          const newQuery = event.target.value;
          if (!newQuery) {
              this.searchQuery = newQuery;
              this.fetchContacts(DEFAULT_PAGE);
          }
      },
      onSubmit(event) {
          const formData = new FormData(event.target);
          const contactIds = formData.getAll('contactIds[]')
          this.$store.dispatch('forwardMessage', {
              conversationId: this.message.conversation_id,
              messageId: this.message.id,
              contacts: contactIds
          });
          useAlert("Encaminhando mensagem...");
          this.onClose();
      }
  }
}
</script>

<style lang="scss">
.modal-mask .modal--close {
  z-index: 51;
}

.modal-container {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
