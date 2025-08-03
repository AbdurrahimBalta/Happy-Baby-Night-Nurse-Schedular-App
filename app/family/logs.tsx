import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, Calendar, Clock, Search, Filter, Moon, Baby, Droplet, Smile, Frown, Wind, Heart, Thermometer } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

interface NightLogSummary {
  id: string;
  date: string;
  nurseName: string;
  shift: string;
  temperament: string;
  sleepHours: string;
  feedings: number;
  diapers: number;
}

export default function NightLogsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<NightLogSummary[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<NightLogSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTemperament, setSelectedTemperament] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // TODO: Fetch night logs from Supabase
  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        // TODO: Implement real API call to fetch night logs from Supabase
        // For now, set empty array
        setLogs([]);
        setFilteredLogs([]);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLogs();
  }, []);

  // Filter logs based on search query and filters
  useEffect(() => {
    let filtered = [...logs];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.nurseName.toLowerCase().includes(query) ||
        new Date(log.date).toLocaleDateString().toLowerCase().includes(query)
      );
    }
    
    // Apply temperament filter
    if (selectedTemperament) {
      filtered = filtered.filter(log => log.temperament === selectedTemperament);
    }
    
    // Apply month filter
    if (selectedMonth) {
      filtered = filtered.filter(log => {
        const logDate = new Date(log.date);
        const monthYear = `${logDate.getFullYear()}-${String(logDate.getMonth() + 1).padStart(2, '0')}`;
        return monthYear === selectedMonth;
      });
    }
    
    setFilteredLogs(filtered);
  }, [logs, searchQuery, selectedTemperament, selectedMonth]);

  const getTemperamentIcon = (temperament: string) => {
    switch (temperament) {
      case 'happy':
        return <Smile size={20} color={COLORS.success} />;
      case 'fussy':
        return <Frown size={20} color={COLORS.warning} />;
      case 'gassy':
        return <Wind size={20} color={COLORS.primary} />;
      case 'sick':
        return <Thermometer size={20} color={COLORS.error} />;
      case 'calm':
        return <Heart size={20} color={COLORS.primary} />;
      default:
        return <Smile size={20} color={COLORS.success} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUniqueMonths = () => {
    const months = new Set<string>();
    logs.forEach(log => {
      const date = new Date(log.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthYear);
    });
    return Array.from(months).sort().reverse();
  };

  const getMonthName = (monthYear: string) => {
    const [year, month] = monthYear.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
  };

  const isYesterday = (dateString: string) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const date = new Date(dateString);
    return date.toDateString() === yesterday.toDateString();
  };

  const renderLogItem = ({ item, index }: { item: NightLogSummary, index: number }) => (
    <TouchableOpacity
      style={[
        styles.logCard,
        index === 0 && styles.mostRecentLogCard
      ]}
      onPress={() => router.push(`/shared/night-log/${item.id}`)}
    >
      {index === 0 && (
        <View style={styles.mostRecentBadge}>
          <Text style={styles.mostRecentText}>Most Recent</Text>
        </View>
      )}
      <View style={styles.logHeader}>
        <View style={styles.dateContainer}>
          <Calendar size={16} color={COLORS.primary} />
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
          {isToday(item.date) && <Text style={styles.todayBadge}>Today</Text>}
          {isYesterday(item.date) && <Text style={styles.yesterdayBadge}>Yesterday</Text>}
        </View>
        <View style={styles.temperamentContainer}>
          {getTemperamentIcon(item.temperament)}
          <Text style={styles.temperamentText}>
            {item.temperament.charAt(0).toUpperCase() + item.temperament.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.nurseInfo}>
        <Text style={styles.nurseName}>{item.nurseName}</Text>
        <View style={styles.shiftContainer}>
          <Clock size={14} color={COLORS.textSecondary} />
          <Text style={styles.shiftText}>{item.shift}</Text>
        </View>
      </View>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Moon size={16} color={COLORS.primary} />
          <Text style={styles.summaryText}>{item.sleepHours}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Baby size={16} color={COLORS.primary} />
          <Text style={styles.summaryText}>{item.feedings} feedings</Text>
        </View>
        <View style={styles.summaryItem}>
          <Droplet size={16} color={COLORS.primary} />
          <Text style={styles.summaryText}>{item.diapers} diapers</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Night Logs</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by nurse or date..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>Filter by:</Text>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Temperament</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.temperamentFilters}
            >
              <TouchableOpacity
                style={[
                  styles.temperamentFilter,
                  selectedTemperament === null && styles.selectedFilter
                ]}
                onPress={() => setSelectedTemperament(null)}
              >
                <Text style={[
                  styles.temperamentFilterText,
                  selectedTemperament === null && styles.selectedFilterText
                ]}>All</Text>
              </TouchableOpacity>
              {['happy', 'fussy', 'gassy', 'calm', 'sick'].map(temp => (
                <TouchableOpacity
                  key={temp}
                  style={[
                    styles.temperamentFilter,
                    selectedTemperament === temp && styles.selectedFilter
                  ]}
                  onPress={() => setSelectedTemperament(temp)}
                >
                  {getTemperamentIcon(temp)}
                  <Text style={[
                    styles.temperamentFilterText,
                    selectedTemperament === temp && styles.selectedFilterText
                  ]}>
                    {temp.charAt(0).toUpperCase() + temp.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Month</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.monthFilters}
            >
              <TouchableOpacity
                style={[
                  styles.monthFilter,
                  selectedMonth === null && styles.selectedFilter
                ]}
                onPress={() => setSelectedMonth(null)}
              >
                <Text style={[
                  styles.monthFilterText,
                  selectedMonth === null && styles.selectedFilterText
                ]}>All</Text>
              </TouchableOpacity>
              {getUniqueMonths().map(month => (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.monthFilter,
                    selectedMonth === month && styles.selectedFilter
                  ]}
                  onPress={() => setSelectedMonth(month)}
                >
                  <Text style={[
                    styles.monthFilterText,
                    selectedMonth === month && styles.selectedFilterText
                  ]}>
                    {getMonthName(month)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading night logs...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredLogs}
          renderItem={renderLogItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.logsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No night logs found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  filtersContainer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  temperamentFilters: {
    paddingVertical: 4,
    gap: 8,
  },
  temperamentFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedFilter: {
    backgroundColor: COLORS.primary,
  },
  temperamentFilterText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 4,
  },
  selectedFilterText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  monthFilters: {
    paddingVertical: 4,
    gap: 8,
  },
  monthFilter: {
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  monthFilterText: {
    fontSize: 14,
    color: COLORS.text,
  },
  logsList: {
    padding: 16,
  },
  logCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  mostRecentLogCard: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    position: 'relative',
    paddingTop: 24,
  },
  mostRecentBadge: {
    position: 'absolute',
    top: -12,
    left: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  mostRecentText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 8,
  },
  todayBadge: {
    fontSize: 12,
    color: COLORS.white,
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  yesterdayBadge: {
    fontSize: 12,
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  temperamentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  temperamentText: {
    marginLeft: 6,
    fontSize: 14,
    color: COLORS.text,
  },
  nurseInfo: {
    marginBottom: 12,
  },
  nurseName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  shiftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shiftText: {
    marginLeft: 6,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    padding: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    marginLeft: 6,
    fontSize: 14,
    color: COLORS.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

// Remove unused TextInput component - using React Native TextInput instead