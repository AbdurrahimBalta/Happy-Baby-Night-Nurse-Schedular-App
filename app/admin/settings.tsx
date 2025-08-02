import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, Settings as SettingsIcon, Users, Bell, Shield, Database, CreditCard, Mail, Globe, Smartphone, Lock, Eye, Download, Upload, Trash2, TriangleAlert as AlertTriangle, CircleHelp as HelpCircle, MessageSquare, Calendar, ChartBar as BarChart3, FileText, Zap } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import CustomButton from '@/components/common/CustomButton';

interface SettingItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  destructive?: boolean;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export default function AdminSettingsScreen() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Settings state
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This will export all system data including nurse profiles, family information, and shift records. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: async () => {
            setIsLoading(true);
            // Simulate export process
            setTimeout(() => {
              setIsLoading(false);
              Alert.alert('Success', 'Data export completed. Download link has been sent to your email.');
            }, 3000);
          }
        }
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'Select the data file you want to import. This will overwrite existing data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Select File', 
          onPress: () => {
            Alert.alert('Info', 'File picker would open here in a real implementation.');
          }
        }
      ]
    );
  };

  const handleResetSystem = () => {
    Alert.alert(
      'Reset System',
      'This will reset all system settings to default values. User data will not be affected. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'System settings have been reset to defaults.');
          }
        }
      ]
    );
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      'Delete All Data',
      'WARNING: This will permanently delete ALL data including nurses, families, shifts, and messages. This action cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'I Understand, Delete Everything', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'Type "DELETE EVERYTHING" to confirm this irreversible action.',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Confirm Deletion', 
                  style: 'destructive',
                  onPress: () => {
                    Alert.alert('Cancelled', 'Data deletion cancelled for safety. Contact technical support for data removal.');
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const settingSections: SettingSection[] = [
    {
      title: 'User Management',
      items: [
        {
          id: 'manage-nurses',
          title: 'Nurse Management',
          subtitle: 'Add, edit, and manage nurse profiles',
          icon: <Users size={20} color={COLORS.primary} />,
          type: 'navigation',
          onPress: () => router.push('/admin/nurses')
        },
        {
          id: 'manage-families',
          title: 'Family Management',
          subtitle: 'Manage family accounts and preferences',
          icon: <Users size={20} color={COLORS.primary} />,
          type: 'navigation',
          onPress: () => router.push('/admin/families')
        },
        {
          id: 'user-permissions',
          title: 'User Permissions',
          subtitle: 'Configure access levels and permissions',
          icon: <Shield size={20} color={COLORS.primary} />,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'User permissions management would open here.')
        }
      ]
    },
    {
      title: 'Communication Settings',
      items: [
        {
          id: 'push-notifications',
          title: 'Push Notifications',
          subtitle: 'Enable system-wide push notifications',
          icon: <Bell size={20} color={COLORS.primary} />,
          type: 'toggle',
          value: pushNotifications,
          onToggle: setPushNotifications
        },
        {
          id: 'email-notifications',
          title: 'Email Notifications',
          subtitle: 'Send email notifications for important events',
          icon: <Mail size={20} color={COLORS.primary} />,
          type: 'toggle',
          value: emailNotifications,
          onToggle: setEmailNotifications
        },
        {
          id: 'message-templates',
          title: 'Message Templates',
          subtitle: 'Manage automated message templates',
          icon: <MessageSquare size={20} color={COLORS.primary} />,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Message templates management would open here.')
        }
      ]
    },
    {
      title: 'System Configuration',
      items: [
        {
          id: 'app-settings',
          title: 'Application Settings',
          subtitle: 'Configure app behavior and features',
          icon: <SettingsIcon size={20} color={COLORS.primary} />,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Application settings would open here.')
        },
        {
          id: 'shift-settings',
          title: 'Shift Management',
          subtitle: 'Configure shift scheduling and rules',
          icon: <Calendar size={20} color={COLORS.primary} />,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Shift management settings would open here.')
        },
        {
          id: 'payment-settings',
          title: 'Payment Configuration',
          subtitle: 'Manage payment processing settings',
          icon: <CreditCard size={20} color={COLORS.primary} />,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Payment configuration would open here.')
        },
        {
          id: 'auto-backup',
          title: 'Automatic Backup',
          subtitle: 'Enable daily automatic data backups',
          icon: <Database size={20} color={COLORS.primary} />,
          type: 'toggle',
          value: autoBackup,
          onToggle: setAutoBackup
        }
      ]
    },
    {
      title: 'Security & Privacy',
      items: [
        {
          id: 'two-factor-auth',
          title: 'Two-Factor Authentication',
          subtitle: 'Require 2FA for admin access',
          icon: <Shield size={20} color={COLORS.primary} />,
          type: 'toggle',
          value: twoFactorAuth,
          onToggle: setTwoFactorAuth
        },
        {
          id: 'password-policy',
          title: 'Password Policy',
          subtitle: 'Configure password requirements',
          icon: <Lock size={20} color={COLORS.primary} />,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Password policy settings would open here.')
        },
        {
          id: 'audit-logs',
          title: 'Audit Logs',
          subtitle: 'View system access and activity logs',
          icon: <Eye size={20} color={COLORS.primary} />,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Audit logs would open here.')
        },
        {
          id: 'privacy-settings',
          title: 'Privacy Settings',
          subtitle: 'Configure data privacy and retention',
          icon: <Shield size={20} color={COLORS.primary} />,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Privacy settings would open here.')
        }
      ]
    },
    {
      title: 'Reports & Analytics',
      items: [
        {
          id: 'system-reports',
          title: 'System Reports',
          subtitle: 'Generate and view system reports',
          icon: <BarChart3 size={20} color={COLORS.primary} />,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'System reports would open here.')
        },
        {
          id: 'analytics-dashboard',
          title: 'Analytics Dashboard',
          subtitle: 'View detailed system analytics',
          icon: <BarChart3 size={20} color={COLORS.primary} />,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Analytics dashboard would open here.')
        },
        {
          id: 'export-reports',
          title: 'Export Reports',
          subtitle: 'Export data and generate reports',
          icon: <FileText size={20} color={COLORS.primary} />,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Report export would open here.')
        }
      ]
    },
    {
      title: 'Data Management',
      items: [
        {
          id: 'export-data',
          title: 'Export Data',
          subtitle: 'Export all system data for backup',
          icon: <Download size={20} color={COLORS.primary} />,
          type: 'action',
          onPress: handleExportData
        },
        {
          id: 'import-data',
          title: 'Import Data',
          subtitle: 'Import data from backup file',
          icon: <Upload size={20} color={COLORS.primary} />,
          type: 'action',
          onPress: handleImportData
        },
        {
          id: 'database-maintenance',
          title: 'Database Maintenance',
          subtitle: 'Optimize and maintain database',
          icon: <Database size={20} color={COLORS.primary} />,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Database maintenance tools would open here.')
        }
      ]
    },
    {
      title: 'Advanced Settings',
      items: [
        {
          id: 'maintenance-mode',
          title: 'Maintenance Mode',
          subtitle: 'Enable maintenance mode for system updates',
          icon: <AlertTriangle size={20} color={COLORS.warning} />,
          type: 'toggle',
          value: maintenanceMode,
          onToggle: setMaintenanceMode
        },
        {
          id: 'debug-mode',
          title: 'Debug Mode',
          subtitle: 'Enable detailed logging for troubleshooting',
          icon: <Zap size={20} color={COLORS.warning} />,
          type: 'toggle',
          value: debugMode,
          onToggle: setDebugMode
        },
        {
          id: 'api-settings',
          title: 'API Configuration',
          subtitle: 'Configure external API integrations',
          icon: <Globe size={20} color={COLORS.primary} />,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'API configuration would open here.')
        },
        {
          id: 'mobile-app-settings',
          title: 'Mobile App Settings',
          subtitle: 'Configure mobile app behavior',
          icon: <Smartphone size={20} color={COLORS.primary} />,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Mobile app settings would open here.')
        }
      ]
    },
    {
      title: 'Support & Help',
      items: [
        {
          id: 'help-documentation',
          title: 'Help Documentation',
          subtitle: 'Access admin help and documentation',
          icon: <HelpCircle size={20} color={COLORS.primary} />,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Help documentation would open here.')
        },
        {
          id: 'contact-support',
          title: 'Contact Support',
          subtitle: 'Get help from technical support',
          icon: <MessageSquare size={20} color={COLORS.primary} />,
          type: 'navigation',
          onPress: () => Alert.alert('Info', 'Support contact form would open here.')
        },
        {
          id: 'system-info',
          title: 'System Information',
          subtitle: 'View system version and status',
          icon: <SettingsIcon size={20} color={COLORS.primary} />,
          type: 'navigation',
          onPress: () => Alert.alert('System Info', 'Happy Baby Night Nurses Admin\nVersion 1.0.0\nBuild 2024.03.15')
        }
      ]
    },
    {
      title: 'Danger Zone',
      items: [
        {
          id: 'reset-system',
          title: 'Reset System Settings',
          subtitle: 'Reset all settings to default values',
          icon: <AlertTriangle size={20} color={COLORS.error} />,
          type: 'action',
          onPress: handleResetSystem,
          destructive: true
        },
        {
          id: 'delete-all-data',
          title: 'Delete All Data',
          subtitle: 'Permanently delete all system data',
          icon: <Trash2 size={20} color={COLORS.error} />,
          type: 'action',
          onPress: handleDeleteAllData,
          destructive: true
        }
      ]
    }
  ];

  const renderSettingItem = (item: SettingItem) => {
    switch (item.type) {
      case 'toggle':
        return (
          <View key={item.id} style={styles.settingItem}>
            <View style={styles.settingContent}>
              <View style={styles.settingIcon}>
                {item.icon}
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: COLORS.border, true: COLORS.primary + '40' }}
              thumbColor={item.value ? COLORS.primary : COLORS.white}
            />
          </View>
        );
      
      case 'navigation':
      case 'action':
        return (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.settingItem,
              item.destructive && styles.destructiveItem
            ]}
            onPress={item.onPress}
          >
            <View style={styles.settingContent}>
              <View style={[
                styles.settingIcon,
                item.destructive && styles.destructiveIcon
              ]}>
                {item.icon}
              </View>
              <View style={styles.settingText}>
                <Text style={[
                  styles.settingTitle,
                  item.destructive && styles.destructiveText
                ]}>
                  {item.title}
                </Text>
                <Text style={[
                  styles.settingSubtitle,
                  item.destructive && styles.destructiveSubtext
                ]}>
                  {item.subtitle}
                </Text>
              </View>
            </View>
            {item.type === 'navigation' && (
              <ChevronRight size={20} color={COLORS.textSecondary} />
            )}
          </TouchableOpacity>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              section.title === 'Danger Zone' && styles.dangerSectionTitle
            ]}>
              {section.title}
            </Text>
            
            <View style={[
              styles.sectionContent,
              section.title === 'Danger Zone' && styles.dangerSection
            ]}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <CustomButton
              title="Backup Now"
              onPress={() => Alert.alert('Success', 'Backup initiated successfully.')}
              style={styles.quickActionButton}
              outline
            />
            <CustomButton
              title="Send Test Alert"
              onPress={() => Alert.alert('Test Alert', 'This is a test notification sent to all users.')}
              style={styles.quickActionButton}
              outline
            />
          </View>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Happy Baby Night Nurses Admin Panel</Text>
          <Text style={styles.versionNumber}>Version 1.0.0 • Build 2024.03.15</Text>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Exporting data...</Text>
            <Text style={styles.loadingSubtext}>This may take a few minutes</Text>
          </View>
        </View>
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
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  dangerSectionTitle: {
    color: COLORS.error,
  },
  sectionContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  dangerSection: {
    borderWidth: 1,
    borderColor: COLORS.error + '20',
    backgroundColor: COLORS.errorLight,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  destructiveItem: {
    backgroundColor: COLORS.errorLight,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destructiveIcon: {
    backgroundColor: COLORS.error + '20',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 2,
  },
  destructiveText: {
    color: COLORS.error,
  },
  settingSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  destructiveSubtext: {
    color: COLORS.error + 'AA',
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  versionNumber: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});