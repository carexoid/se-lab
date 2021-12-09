import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        fontSize: 14,
        marginBottom: 10,
    },
    section: {
        margin: 10,
        padding: 10,
        //flexGrow: 1
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
    },
    big: {
        fontSize: 18,
    },
    indent: {
        marginLeft: 20,
    },
});

function PDFGenerator({ order }) {
    const flight = order.tickets[0].flight
    const tickets = order.tickets
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.title}>Order Information</Text>
                </View>
                <View style={styles.section}>
                    <Text>Order ID: {order.order_id}</Text>
                    <Text>Created at: {order.created_at}</Text>
                    <Text>Status: {order.state === 1 ? (order.state === 2 ? "Offline" : "Completed") :'Waiting for Payment'}</Text>
                </View>
                <View style={styles.section}>
                    <Text>Flight ID: {flight.id}</Text>
                    <Text>Destination: {flight.city}, {flight.airport_name}</Text>
                    <Text>Departure: {flight.departure_at}</Text>
                    <Text>Arrival: {flight.arrival_at}</Text>
                    <Text>Tickets:</Text>
                    {tickets.map((t) =>
                        <Text style={styles.indent}>{t.type === 0 ? 'Econom' : 'Business'}, seat {t.seat}</Text>
                    )}
                    <Text>(Quantity: {tickets.length})</Text>
                </View>
                <View style={styles.section}>
                    <Text>Total: {order.full_price} $</Text>
                </View>
            </Page>
        </Document>
    );
}

export default PDFGenerator;