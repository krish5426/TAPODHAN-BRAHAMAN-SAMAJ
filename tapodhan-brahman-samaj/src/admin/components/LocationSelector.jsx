import React, { useState, useEffect } from 'react';

const LocationSelector = ({ onLocationChange }) => {
    const [country] = useState("India");
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [manualCity, setManualCity] = useState('');
    const [isManualCity, setIsManualCity] = useState(false);

    const [loadingStates, setLoadingStates] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [error, setError] = useState('');

    // Fetch States on Mount
    useEffect(() => {
        const fetchStates = async () => {
            setLoadingStates(true);
            setError('');
            try {
                const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ country: 'India' })
                });
                const data = await response.json();
                if (!data.error) {
                    setStates(data.data.states || []);
                } else {
                    setError('Failed to load states');
                }
            } catch (err) {
                setError('Network error loading states');
            } finally {
                setLoadingStates(false);
            }
        };

        fetchStates();
    }, []);

    // Fetch Cities when State changes
    useEffect(() => {
        if (!selectedState) {
            setCities([]);
            return;
        }

        const fetchCities = async () => {
            setLoadingCities(true);
            setError('');
            try {
                const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ country: 'India', state: selectedState })
                });
                const data = await response.json();
                if (!data.error) {
                    setCities(data.data || []);
                } else {
                    setError('Failed to load cities');
                }
            } catch (err) {
                setError('Network error loading cities');
            } finally {
                setLoadingCities(false);
            }
        };

        fetchCities();
    }, [selectedState]);

    // Handle Selection Changes
    const handleStateChange = (e) => {
        const newState = e.target.value;
        setSelectedState(newState);
        setSelectedCity('');
        setIsManualCity(false);
        setManualCity('');
        notifyParent(newState, '', false);
    };

    const handleCityChange = (e) => {
        const val = e.target.value;
        if (val === 'manual_add_option') {
            setIsManualCity(true);
            setSelectedCity('');
            notifyParent(selectedState, '', true);
        } else {
            setIsManualCity(false);
            setSelectedCity(val);
            notifyParent(selectedState, val, false);
        }
    };

    const handleManualCityChange = (e) => {
        const val = e.target.value;
        setManualCity(val);
        notifyParent(selectedState, val, true);
    };

    const notifyParent = (stm, cty, isManual) => {
        if (onLocationChange) {
            onLocationChange({
                country: 'India',
                state: stm,
                city: isManual ? manualCity : cty
            });
        }
    };

    // Update parent when manual city input changes (debouncing could be good but keeping simple for now)
    // Actually, let's update parent on blur or just every change? 
    // The requirement says "Manually added city should appear... immediately". 
    // I will call notifyParent inside handleManualCityChange for immediate updates.
    useEffect(() => {
        if (isManualCity) {
            notifyParent(selectedState, manualCity, true);
        }
    }, [manualCity]);


    const styles = {
        container: {
            padding: '20px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#fff',
            marginTop: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        },
        header: {
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#333'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
        },
        field: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        },
        label: {
            fontSize: '14px',
            fontWeight: '500',
            color: '#555'
        },
        select: {
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s',
            backgroundColor: '#fff'
        },
        input: {
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px',
            outline: 'none',
            marginTop: '10px'
        },
        error: {
            color: 'red',
            fontSize: '13px',
            marginTop: '10px'
        }
    };

    return (
        <div style={styles.container}>
            <h3 style={styles.header}>Location Details</h3>

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.grid}>
                {/* Country Field */}
                <div style={styles.field}>
                    <label style={styles.label}>Country</label>
                    <input
                        type="text"
                        value={country}
                        disabled
                        style={{ ...styles.select, backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                    />
                </div>

                {/* State Field */}
                <div style={styles.field}>
                    <label style={styles.label}>State</label>
                    <select
                        value={selectedState}
                        onChange={handleStateChange}
                        style={styles.select}
                        disabled={loadingStates}
                    >
                        <option value="">Select State</option>
                        {loadingStates ? (
                            <option>Loading...</option>
                        ) : (
                            states.map((s) => (
                                <option key={s.name} value={s.name}>{s.name}</option>
                            ))
                        )}
                    </select>
                </div>

                {/* City Field */}
                <div style={styles.field}>
                    <label style={styles.label}>City</label>
                    <select
                        value={isManualCity ? "manual_add_option" : selectedCity}
                        onChange={handleCityChange}
                        style={styles.select}
                        disabled={!selectedState || loadingCities}
                    >
                        <option value="">Select City</option>
                        {loadingCities ? (
                            <option>Loading...</option>
                        ) : (
                            cities.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))
                        )}
                        <option value="manual_add_option" style={{ fontWeight: 'bold' }}>+ Add New City</option>
                    </select>

                    {isManualCity && (
                        <input
                            type="text"
                            placeholder="Enter city name"
                            value={manualCity}
                            onChange={handleManualCityChange}
                            style={styles.input}
                            autoFocus
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocationSelector;
