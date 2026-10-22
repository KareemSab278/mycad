import { useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as C from '../../../components';
import { DemoSection } from '../../../components/ComponentsDemo/components';
import type { DemoTabId } from '../../../components/ComponentsDemo/helpers';
import { countryOptions, demoTabs, demoTags } from '../../../components/ComponentsDemo/helpers';
import { styles } from '../../../components/ComponentsDemo/styles';

export const ComponentsDemo = () => {
  const [activeTab, setActiveTab] = useState<DemoTabId>('buttons');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Mobile']);
  const [country, setCountry] = useState<string|undefined>(undefined);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
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
    <SafeAreaView style={styles.screen}>
      <C.Tabs
        items={demoTabs.map(({ id, label }) => ({ value: id, label }))}
        value={activeTab}
        onValueChange={setActiveTab}
      />
      <ScrollView contentContainerStyle={styles.pageContent}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>MyCAD component library</Text>
          <Text style={styles.title}>Components</Text>
          <Text style={styles.subtitle}>
            Interactive examples of the shared components. Choose a tab to explore each group.
          </Text>
        </View>

        {activeTab === 'buttons' ? (
          <View style={styles.panel}>
            <DemoSection
              title="Buttons"
              description="HeroUI buttons use the shared ripple and scale press feedback."
            >
              <View style={styles.buttonRow}>
                <C.Buttons.Primary onPress={() => setFeedback('Primary button pressed.')} label='Primary' />
                <C.Buttons.Secondary onPress={() => setFeedback('Secondary button pressed.')} label='Secondary' />
                <C.Buttons.Danger onPress={() => setFeedback('Danger button pressed.')} label='Danger' />
                <C.Buttons.Ghost onPress={() => setFeedback('Ghost button pressed.')} label='Ghost' />
              </View>
              <Text style={styles.resultText}>{feedback}</Text>
            </DemoSection>

            <DemoSection title="Pressable feedback">
              <C.PressableFeedback
                onPress={() => setFeedback('Ripple and 0.9 scale feedback pressed.')}
                style={styles.feedbackSurface}
              >
                <Text style={styles.feedbackText}>Tap to see ripple + scale</Text>
              </C.PressableFeedback>
              <C.LinkButton onPress={() => setFeedback('Terms and conditions link pressed.')}>
                Terms and conditions
              </C.LinkButton>
              <Text style={styles.resultText}>{feedback}</Text>
            </DemoSection>

            <DemoSection title="Tag group" description="Select one or more tags.">
              <C.TagGroup
                tags={demoTags}
                selectedTags={selectedTags}
                onSelectionChange={setSelectedTags}
              />
              <Text style={styles.resultText}>
                Selected: {selectedTags.length ? selectedTags.join(', ') : 'none'}
              </Text>
            </DemoSection>
          </View>
        ) : null}

        {activeTab === 'forms' ? (
          <View style={styles.panel}>
            <DemoSection title="Text inputs">
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
            </DemoSection>

            <DemoSection title="Selection controls">
              <View style={styles.formStack}>
                <C.Toggler
                  label="Notifications"
                  value={isEnabled}
                  onValueChange={setIsEnabled}
                />
                <C.CheckBox
                  label="I agree to the terms"
                  checked={isChecked}
                  onValueChange={setIsChecked}
                />
                <View style={styles.formStack}>
                  <Text style={styles.resultText}>Slider value: {sliderValue}</Text>
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
            </DemoSection>
            <DemoSection title="Calendar" description="Choose a date and navigate between months.">
              <C.Buttons.Primary
                label="Choose date"
                onPress={() => setCalendarModalVisible(true)}
              />
              <Text style={styles.resultText}>
                Selected date: {selectedDate.toLocaleDateString()}
              </Text>
              <C.Modal
                visible={calendarModalVisible}
                onClose={() => setCalendarModalVisible(false)}
              >
                <Text style={styles.cardTitle}>Select a date</Text>
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
            </DemoSection>
          </View>
        ) : null}

        {activeTab === 'overlays' ? (
          <View style={styles.panel}>
            <DemoSection title="Menu">
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
              <Text style={styles.resultText}>{feedback}</Text>
            </DemoSection>

            <DemoSection title="Modal and dialog">
              <View style={styles.buttonRow}>
                <C.Buttons.Secondary onPress={() => setModalVisible(true)} label="Open modal" />
                <C.Buttons.Primary label="Open dialog" onPress={() => setDialogVisible(true)} />
              </View>
              <C.Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
                <Text style={styles.cardTitle}>Modal content</Text>
                <Text style={styles.cardDescription}>
                  A modal can contain any content and actions.
                </Text>
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
            </DemoSection>

            <DemoSection title="Alerts">
              <C.Buttons.Secondary
                onPress={() => setAlertBatch((batch) => batch + 1)}
                label="Reshow alerts"
              />
              <View style={styles.formStack}>
                <View key={alertBatch} style={styles.formStack}>
                  <C.Alert tone="info" title="Information" message="Your profile is up to date." />
                  <C.Alert tone="success" message="Changes saved successfully." />
                  <C.Alert tone="warning" message="Check the details before continuing." />
                  <C.Alert tone="error" message="Something needs your attention." />
                </View>
              </View>
            </DemoSection>
          </View>
        ) : null}

        {activeTab === 'display' ? (
          <View style={styles.panel}>
            <DemoSection title="Typography">
              <View style={styles.displayStack}>
                <C.Typography variant="heading">Heading</C.Typography>
                <C.Typography variant="title">Title text</C.Typography>
                <C.Typography variant="body">Body text for regular content.</C.Typography>
                <C.Typography variant="caption">Caption text for supporting details.</C.Typography>
              </View>
            </DemoSection>

            <DemoSection title="Loading states">
              <View style={styles.buttonRow}>
                <C.Loader />
                <C.Skeleton width={180} />
                <C.Skeleton width={260} height={28} />
              </View>
            </DemoSection>

            <DemoSection title="Cards">
              <View style={styles.displayStack}>
                <C.Card>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>Card without image</Text>
                    <Text style={styles.cardDescription}>
                      A simple content card. Tap to see its press feedback.
                    </Text>
                  </View>
                </C.Card>
                <C.Card
                  imageSource={
                    require('../../../../assets/images/tutorial-web.png') as ImageSourcePropType
                  }
                  onPress={() => setFeedback('Image card pressed.')}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>Card with image</Text>
                    <Text style={styles.cardDescription}>The card image is optional.</Text>
                  </View>
                </C.Card>
              </View>
            </DemoSection>

            <DemoSection title="Separators">
              <View style={styles.displayStack}>
                <C.Separator variant="sm" />
                <C.Separator variant="md" />
                <C.Separator variant="lg" color="#208AEF" />
              </View>
            </DemoSection>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ComponentsDemo;