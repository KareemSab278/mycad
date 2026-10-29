import { Fragment, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorSchemePreference } from '../../hooks/color-scheme-context';
import { useColorScheme } from '../../hooks/use-color-scheme';
import * as C from './../../components';
import { ChartsDemo } from './ChartsDemo';
import type { DemoTabId } from './helpers';
import { countryOptions, demoTabs, demoTags } from './helpers';
import { styles } from './styles';

export const ComponentsDemo = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<DemoTabId>('buttons');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Mobile']);
  const [country, setCountry] = useState<string | undefined>(undefined);
  const colorScheme = useColorScheme();
  const { setPreference } = useColorSchemePreference();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [sliderValue, setSliderValue] = useState<number>(35);
  const [displayName, setDisplayName] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('Tap a control to see its response.');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [calendarModalVisible, setCalendarModalVisible] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<(Date)>(new Date());
  const [alertBatch, setAlertBatch] = useState<number>(0);

  return (
    <C.Container contentContainerStyle={{ paddingTop: insets.top + C.TABS_HEIGHT + C.TABS_TOP_GAP + 12 }}>
      <C.Tabs
        items={demoTabs.map(({ id, label }) => ({ value: id, label }))}
        value={activeTab}
        onValueChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'overlays') {
            setAlertBatch(0);
          }
        }}
      />
      {activeTab === 'buttons' ? (
        <View style={styles.panel}>
          <C.Box
            title="Buttons"
            description="Shared button variants for common actions."
          >
            <View style={styles.buttonRow}>
              <C.Buttons.Primary onPress={() => setFeedback('Primary button pressed.')} label='Primary' />
              <C.Buttons.Secondary onPress={() => setFeedback('Secondary button pressed.')} label='Secondary' />
              <C.Buttons.Danger onPress={() => setFeedback('Danger button pressed.')} label='Danger' />
              <C.Buttons.Ghost onPress={() => setFeedback('Ghost button pressed.')} label='Ghost' />
            </View>
            <C.Typography variant='caption' text={feedback} />
          </C.Box>

          <C.Box title="Pressable surface">
            <Pressable
              accessibilityRole="button"
              onPress={() => setFeedback('Pressable surface pressed.')}
              style={styles.feedbackSurface}
            >
              <C.Typography variant='caption' text="Tap to interact" />
            </Pressable>
            <C.LinkButton
              onPress={() => setFeedback('Terms and conditions link pressed.')}
              text="Terms and conditions"
            />
            <C.Typography variant='caption' text={feedback} />
          </C.Box>

          <C.Box title="Tag group" description="Select one or more tags.">
            <C.TagGroup
              tags={demoTags}
              selectedTags={selectedTags}
              onSelectionChange={setSelectedTags}
            />
            <C.Typography variant='caption' text={`Selected: ${selectedTags.length ? selectedTags.join(', ') : 'none'}`} />
          </C.Box>
        </View>
      ) : null}

      {activeTab === 'forms' ? (
        <View style={styles.panel}>
          <C.Box title="Text inputs">
            <View style={styles.formStack}>
              <C.InputField
                label="Input field"
                placeholder="Your name"
                value={displayName}
                onChangeText={setDisplayName}
                helperText="A labeled field with helper text."
              />
              <C.TextField
                label="Text field"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <C.SearchField
                placeholder="Search components"
                value={search}
                onChangeText={setSearch}
              />
              <C.TextArea
                label="Text area"
                placeholder="Write a note..."
                value={notes}
                onChangeText={setNotes}
                helperText={`${notes.length} characters`}
              />
            </View>
          </C.Box>

          <C.Box title="Selection controls">
            <View style={styles.formStack}>
              <C.Toggler
                label={colorScheme === 'dark' ? 'Dark mode' : 'Light mode'}
                value={colorScheme === 'dark'}
                onValueChange={(isDarkMode) =>
                  setPreference(isDarkMode ? 'dark' : 'light')
                }
              />
              <C.CheckBox
                label="I agree to the terms"
                checked={isChecked}
                onValueChange={setIsChecked}
              />
              <View style={styles.formStack}>
                <C.Typography variant='caption' text={`Slider value: ${sliderValue}`} />
                <C.Slider value={sliderValue} onValueChange={(value) => setSliderValue(value)} />
              </View>
              <C.Selector
                label="Select Country"
                placeholder="Not selected"
                options={countryOptions}
                value={country}
                onValueChange={setCountry}
              />
            </View>
          </C.Box>
          <C.Box title="Calendar" description="Choose a date and navigate between months.">
            <C.Buttons.Primary
              label="Choose date"
              onPress={() => setCalendarModalVisible(true)}
            />
            <C.Typography variant='caption' text={`Selected date: ${selectedDate.toLocaleDateString()}`} />
            <C.Modal
              visible={calendarModalVisible}
              onClose={() => setCalendarModalVisible(false)}
            >
              <C.Typography style={styles.cardTitle} text="Select a date" />
              <C.Calendar
                value={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setCalendarModalVisible(false);
                }}
              />
              <C.Buttons.Secondary
                label="Cancel"
                onPress={() => setCalendarModalVisible(false)}
              />
            </C.Modal>
          </C.Box>
        </View>
      ) : null}

      {activeTab === 'overlays' ? (
        <View style={styles.panel}>
          <C.Box title="Menu">
            <C.Menu
              items={[
                { label: 'Edit profile', onPress: () => setFeedback('Edit profile selected.') },
                { label: 'Share', onPress: () => setFeedback('Share selected.') },
                {
                  label: 'Disabled action',
                  isDisabled: true,
                  onPress: () => setFeedback('This action is disabled.'),
                },
              ]}
            />
            <C.Typography text={feedback} />
          </C.Box>

          <C.Box title="Modal and dialog">
            <View style={styles.buttonRow}>
              <C.Buttons.Secondary onPress={() => setModalVisible(true)} label="Open modal" />
              <C.Buttons.Primary label="Open dialog" onPress={() => setDialogVisible(true)} />
            </View>
            <C.Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
              <C.Typography text="Modal content" />
              <C.Typography variant="caption" text="A modal can contain any content and actions." />
              <C.Buttons.Danger onPress={() => setModalVisible(false)} label="Close modal" />
            </C.Modal>
            <C.Dialog
              visible={dialogVisible}
              onClose={() => setDialogVisible(false)}
              title="Discard changes?"
              description="Your unsaved changes will be lost."
            >
              <View style={styles.buttonRow}>
                <C.Buttons.Secondary
                  onPress={() => setDialogVisible(false)}
                  label="Cancel"
                />
                <C.Buttons.Danger onPress={() => setDialogVisible(false)} label="Discard" />
              </View>
            </C.Dialog>
          </C.Box>

          <C.Box title="Alerts">
            <C.Buttons.Secondary
              onPress={() => setAlertBatch((batch) => batch + 1)}
              label="Reshow alerts"
            />
          </C.Box>
        </View>
      ) : null}
      {activeTab === 'display' ? (
        <View style={styles.panel}>
          <C.Box title="Typography">
            <View style={styles.displayStack}>
              <C.Typography variant="heading" text="Heading" />
              <C.Typography variant="title" text="Title text" />
              <C.Typography variant="body" text="Body text for regular content." />
              <C.Typography variant="caption" text="Caption text for supporting details." />
            </View>
          </C.Box>

          <C.Box title="Loading states">
            <View style={styles.buttonRow}>
              <C.Loader />
              <C.Skeleton width={180} />
              <C.Skeleton width={260} height={28} />
            </View>
          </C.Box>

          <C.Box title="Cards">
            <View style={styles.displayStack}>
              <C.Card>
                <View style={styles.cardContent}>
                  <C.Typography variant="title" text="Card without image" />
                  <C.Typography variant="body" text="A simple content card. Tap to see its press feedback." />
                </View>
              </C.Card>
              <C.Card
                imageSource={
                  require('../../../assets/images/tutorial-web.png') as ImageSourcePropType
                }
                onPress={() => setFeedback('Image card pressed.')}
              >
                <View style={styles.cardContent}>
                  <C.Typography variant="title" text="Card with image" />
                  <C.Typography variant="body" text="The card image is optional." />
                </View>
              </C.Card>
            </View>
          </C.Box>

          <C.Box title="Separators">
            <View style={styles.displayStack}>
              <C.Separator variant="sm" />
              <C.Separator variant="md" />
              <C.Separator variant="lg" color="#208AEF" />
            </View>
          </C.Box>
        </View>
      ) : null}

      {activeTab === 'charts' ? <ChartsDemo /> : null}
      {activeTab === 'overlays' && alertBatch > 0 ? (
        <Fragment key={alertBatch}>
          <C.Alert tone="info" title="Information" message="Your profile is up to date." />
          <C.Alert tone="success" message="Changes saved successfully." />
          <C.Alert tone="warning" message="Check the details before continuing." />
          <C.Alert tone="error" message="Something needs your attention." />
        </Fragment>
      ) : null}
    </C.Container>
  );
};