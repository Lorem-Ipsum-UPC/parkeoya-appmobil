import { api, Parking, Review } from '@/lib/data';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ReviewsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [parking, setParking] = useState<Parking | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      if (id) {
        const [parkingData, reviewsData] = await Promise.all([
          api.getParkingById(id),
          api.getReviews(id),
        ]);
        setParking(parkingData);
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const renderStars = (rating: number, size = 28, interactive = false, onPress?: (star: number) => void) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= Math.floor(rating);
      const isHalf = !isFilled && i - 0.5 <= rating;
      
      const StarComponent = (
        <TouchableOpacity
          key={i}
          disabled={!interactive}
          onPress={() => onPress?.(i)}
          style={{ padding: 2 }}
        >
          <Ionicons
            name={isFilled ? 'star' : isHalf ? 'star-half' : interactive ? 'star-outline' : 'star-outline'}
            size={size}
            color="#FFC107"
          />
        </TouchableOpacity>
      );
      stars.push(StarComponent);
    }
    return stars;
  };

  const toggleReviewExpanded = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleSubmitReview = async () => {
    if (newRating === 0 || !newComment.trim()) {
      alert('Please provide a rating and comment');
      return;
    }

    try {
      await api.addReview({
        parkingId: id || '1',
        userId: 'user1',
        userName: 'Tralalero Tralala',
        userAvatar: 'https://via.placeholder.com/150',
        rating: newRating,
        comment: newComment,
        date: new Date().toISOString(),
      });
      
      setShowReviewModal(false);
      setNewRating(0);
      setNewComment('');
      loadData();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>{parking?.name} Reviews</Text>

        {/* Reviews List */}
        {reviews.map((review) => {
          const isExpanded = expandedReviews.has(review.id);
          const shouldTruncate = review.comment.length > 200;

          return (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image
                  source={{ uri: review.userAvatar }}
                  style={styles.avatar}
                />
                <View style={styles.reviewInfo}>
                  <Text style={styles.userName}>{review.userName}</Text>
                  <View style={styles.starsRow}>
                    {renderStars(review.rating, 24)}
                  </View>
                </View>
              </View>

              <Text style={styles.reviewComment} numberOfLines={isExpanded ? undefined : 4}>
                {review.comment}
              </Text>

              {shouldTruncate && (
                <TouchableOpacity onPress={() => toggleReviewExpanded(review.id)}>
                  <View style={styles.showMoreRow}>
                    <Text style={styles.showMoreText}>
                      {isExpanded ? 'Show less' : 'Show more'}
                    </Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color="#1B5E6F"
                    />
                  </View>
                </TouchableOpacity>
              )}

              <Text style={styles.reviewDate}>{formatDate(review.date)}</Text>
            </View>
          );
        })}

        {/* Make a Review Button */}
        <TouchableOpacity
          style={styles.makeReviewButton}
          onPress={() => setShowReviewModal(true)}
        >
          <Text style={styles.makeReviewButtonText}>Make a review</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Review Modal */}
      <Modal
        visible={showReviewModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReviewModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Make a review</Text>
              <TouchableOpacity
                onPress={() => setShowReviewModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={28} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalBody}>
                <Text style={styles.ratingLabel}>Raiting</Text>
                <View style={styles.starsRow}>
                  {renderStars(newRating, 40, true, setNewRating)}
                </View>

                <TextInput
                  style={styles.commentInput}
                  placeholder="Write your review"
                  placeholderTextColor="#95A5A6"
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  value={newComment}
                  onChangeText={setNewComment}
                />

                <TouchableOpacity
                  style={styles.sendReviewButton}
                  onPress={handleSubmitReview}
                >
                  <Text style={styles.sendReviewButtonText}>Send review</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 24,
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewComment: {
    fontSize: 15,
    color: '#2C3E50',
    lineHeight: 22,
    marginBottom: 12,
  },
  showMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  showMoreText: {
    fontSize: 14,
    color: '#1B5E6F',
    fontWeight: '600',
  },
  reviewDate: {
    fontSize: 14,
    color: '#95A5A6',
  },
  makeReviewButton: {
    backgroundColor: '#1B5E6F',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  makeReviewButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    padding: 24,
  },
  ratingLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  commentInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C3E50',
    marginTop: 24,
    marginBottom: 24,
    minHeight: 150,
  },
  sendReviewButton: {
    backgroundColor: '#1B5E6F',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  sendReviewButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
