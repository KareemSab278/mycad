import { useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Alert,
  Buttons,
  Calendar,
  Card,
  CheckBox,
  Dialog,
  InputField,
  LinkButton,
  Loader,
  Menu,
  Modal,
  PressableFeedback,
  SearchField,
  Selector,
  Separator,
  Skeleton,
  Slider,
  Tabs,
  TagGroup,
  TextArea,
  TextField,
  Toggler,
  Typography
} from '../../../components';
import { DemoSection } from '../../../components/ComponentsDemo/components';
import type { DemoTabId } from '../../../components/ComponentsDemo/helpers';
import {
  countryOptions,
  demoTabs,
  demoTags,
} from '../../../components/ComponentsDemo/helpers';
import { styles } from '../../../components/ComponentsDemo/styles';

export const ComponentsDemo = () => {
  const [activeTab, setActiveTab] = useState<DemoTabId>('buttons');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Mobile']);
  const [country, setCountry] = useState<string>('US');
  const [isEnabled, setIsEnabled] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [sliderValue, setSliderValue] = useState(35);
  const [displayName, setDisplayName] = useState('');
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState('Tap a control to see its response.');
  const [modalVisible, setModalVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.pageContent}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>MyCAD component library</Text>
          <Text style={styles.title}>Components</Text>
          <Text style={styles.subtitle}>
            Interactive examples of the shared components. Choose a tab to explore each group.
          </Text>
        </View>

        <Tabs
          items={demoTabs.map(({ id, label }) => ({ value: id, label }))}
          value={activeTab}
          onValueChange={setActiveTab}
        />

        {activeTab === 'buttons' ? (
          <View style={styles.panel}>
            <DemoSection
              title="Buttons"
              description="HeroUI buttons use the shared ripple and scale press feedback."
            >
              <View style={styles.buttonRow}>
                <Buttons.Primary onPress={() => setFeedback('Primary button pressed.')} label='Primary' />
                <Buttons.Secondary onPress={() => setFeedback('Secondary button pressed.')} label='Secondary' />
                <Buttons.Danger onPress={() => setFeedback('Danger button pressed.')} label='Danger' />
                <Buttons.Ghost onPress={() => setFeedback('Ghost button pressed.')} label='Ghost' />
              </View>
              <Text style={styles.resultText}>{feedback}</Text>
            </DemoSection>

            <DemoSection title="Pressable feedback">
              <PressableFeedback
                onPress={() => setFeedback('Ripple and 0.9 scale feedback pressed.')}
                style={styles.feedbackSurface}
              >
                <Text style={styles.feedbackText}>Tap to see ripple + scale</Text>
              </PressableFeedback>
              <LinkButton onPress={() => setFeedback('Terms and conditions link pressed.')}>
                Terms and conditions
              </LinkButton>
              <Text style={styles.resultText}>{feedback}</Text>
            </DemoSection>

            <DemoSection title="Tag group" description="Select one or more tags.">
              <TagGroup
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
                <InputField
                  label="Input field"
                  placeholder="Your name"
                  value={displayName}
                  onChangeText={setDisplayName}
                  helperText="A labeled field with helper text."
                />
                <TextField
                  label="Text field"
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <SearchField
                  placeholder="Search components"
                  value={search}
                  onChangeText={setSearch}
                />
                <TextArea
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
                <Toggler
                  label="Notifications"
                  value={isEnabled}
                  onValueChange={setIsEnabled}
                />
                <CheckBox
                  label="I agree to the terms"
                  checked={isChecked}
                  onValueChange={setIsChecked}
                />
                <View style={styles.formStack}>
                  <Text style={styles.resultText}>Slider value: {sliderValue}</Text>
                  <Slider value={sliderValue} onValueChange={(value) => setSliderValue(value)} />
                </View>
                <Selector
                  label="Country"
                  options={countryOptions}
                  value={country}
                  onValueChange={setCountry}
                />
              </View>
            </DemoSection>
            <DemoSection title="Calendar" description="Choose a date and navigate between months.">
              <Calendar value={selectedDate} onChange={setSelectedDate} />
              <Text style={styles.resultText}>
                Selected date: {selectedDate.toLocaleDateString()}
              </Text>
            </DemoSection>
          </View>
        ) : null}

        {activeTab === 'overlays' ? (
          <View style={styles.panel}>
            <DemoSection title="Menu">
              <Menu
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
                <Buttons.Secondary onPress={() => setModalVisible(true)} label="Open modal" />
                <Buttons.Primary label="Open dialog" onPress={() => setDialogVisible(true)} />
              </View>
              <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
                <Text style={styles.cardTitle}>Modal content</Text>
                <Text style={styles.cardDescription}>
                  A modal can contain any content and actions.
                </Text>
                <Buttons.Primary onPress={() => setModalVisible(false)} label="Close modal" />
              </Modal>
              <Dialog
                visible={dialogVisible}
                onClose={() => setDialogVisible(false)}
                title="Discard changes?"
                description="Your unsaved changes will be lost."
              >
                <View style={styles.buttonRow}>
                  <Buttons.Secondary
                    onPress={() => setDialogVisible(false)}
                    label="Cancel"
                  />
                  <Buttons.Danger onPress={() => setDialogVisible(false)} label="Discard" />
                </View>
              </Dialog>
            </DemoSection>

            <DemoSection title="Alerts">
              <View style={styles.formStack}>
                <Alert tone="info" title="Information" message="Your profile is up to date." />
                <Alert tone="success" message="Changes saved successfully." />
                <Alert tone="warning" message="Check the details before continuing." />
                <Alert tone="error" message="Something needs your attention." />
              </View>
            </DemoSection>
          </View>
        ) : null}

        {activeTab === 'display' ? (
          <View style={styles.panel}>
            <DemoSection title="Typography">
              <View style={styles.displayStack}>
                <Typography variant="heading">Heading</Typography>
                <Typography variant="title">Title text</Typography>
                <Typography variant="body">Body text for regular content.</Typography>
                <Typography variant="caption">Caption text for supporting details.</Typography>
              </View>
            </DemoSection>

            <DemoSection title="Loading states">
              <View style={styles.buttonRow}>
                <Loader />
                <Skeleton width={180} />
                <Skeleton width={260} height={28} />
              </View>
            </DemoSection>

            <DemoSection title="Cards">
              <View style={styles.displayStack}>
                <Card>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>Card without image</Text>
                    <Text style={styles.cardDescription}>
                      A simple content card. Tap to see its press feedback.
                    </Text>
                  </View>
                </Card>
                <Card
                  imageSource={
                    require('../../../../assets/images/tutorial-web.png') as ImageSourcePropType
                  }
                  onPress={() => setFeedback('Image card pressed.')}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>Card with image</Text>
                    <Text style={styles.cardDescription}>The card image is optional.</Text>
                  </View>
                </Card>
              </View>
            </DemoSection>

            <DemoSection title="Separators">
              <View style={styles.displayStack}>
                <Separator variant="sm" />
                <Separator variant="md" />
                <Separator variant="lg" color="#208AEF" />
              </View>
            </DemoSection>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ComponentsDemo;