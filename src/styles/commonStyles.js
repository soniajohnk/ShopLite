import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
  },
  details: {
    marginTop: 4,
    fontSize: 14,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
  },

  addButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default commonStyles;