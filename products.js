const productsSettings = {
  settings: {
    analysis: {
      analyzer: {
        my_edge_ngram_analyzer: {
          type: 'custom',
          tokenizer: 'whitespace',
          filter: [
            'lowercase',
            'my_edge_ngram_filter',
          ],
        },
      },
      filter: {
        my_edge_ngram_filter: {
          type: 'edgeNGram',
          min_gram: 1,
          max_gram: 20,
        },
      },
    },
    index: {
      number_of_shards: 1,
      number_of_replicas: 1,
    },
  },
  mappings: {
    product: {
      properties: {
        carbohydrates: {
          type: 'double',
        },
        cellulose: {
          type: 'long',
        },
        fats: {
          type: 'double',
        },
        nutritive_value: {
          type: 'double',
        },
        product_name: {
          type: 'text',
          analyzer: 'my_edge_ngram_analyzer',
          search_analyzer: 'standard',
        },
        proteins: {
          type: 'double',
        },
      },
    },
  },
};

module.exports = productsSettings;
