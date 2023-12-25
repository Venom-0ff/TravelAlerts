const schema = `
type Query {
    project1_setup: Results,
    alerts: [Alert],
    alertsforregion(variable: String): [Alert],
    alertsforsubregion(variable: String): [Alert],
    advisoriesfortraveler(variable: String): [Advisory],
    regions: [String],
    subregions: [String],
    travelers: [String],
},
type Results {
    results: String
},
type Alert {
    country: String
    name: String
    text: String
    date: String
    region: String
    subregion: String
},
type Advisory {
    name: String
    country: String
    text: String
    date: String
},
type Mutation {
    addadvisory(name: String, country: String, text: String, date: String): Advisory
}
`;

export { schema };