export const VALID_VOTERS = [
  { id: "NVN-20000101-0001", phone: "+234 803 123 4567", name: "Ahmed Musa" },
  { id: "NVN-19851212-0002", phone: "+234 812 987 6543", name: "Chioma Okoro" },
  { id: "NVN-19990723-0003", phone: "+234 701 555 0199", name: "Olawale Bakare" },
  { id: "NVN-19780515-0004", phone: "+234 805 222 3333", name: "Fatima Ibrahim" },
  { id: "NVN-20030618-0005", phone: "+234 909 777 8888", name: "Emeka Nwosu" },
  { id: "NVN-19940311-0006", phone: "+234 816 444 5555", name: "Amina Yusuf" },
  { id: "NVN-19871130-0007", phone: "+234 703 111 2222", name: "Tunde Ednut" },
  { id: "NVN-20011225-0008", phone: "+234 802 666 7777", name: "Blessing Udoh" },
  { id: "NVN-19990505-0009", phone: "+234 810 888 9999", name: "Sunday Adenuga" },
  { id: "NVN-20020820-0010", phone: "+234 912 000 1111", name: "Joy Amadi" }
];

export const TEST_VOTERS = [
  { id: "TEST-0001", phone: "+234 000 000 0000", name: "Test User" }
];

export const findVoter = (id) => {
  return [...VALID_VOTERS, ...TEST_VOTERS].find(v => v.id === id);
};
