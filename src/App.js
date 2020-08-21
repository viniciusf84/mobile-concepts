import React, { useState, useEffect, Fragment } from 'react';
import api from './services/api';

import {
	SafeAreaView,
	View,
	FlatList,
	Text,
	StatusBar,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

export default function App() {
	const [repositories, setRepositories] = useState([]);

	async function listRepositories() {
		try {
			const response = await api.get('repositories');
			setRepositories(response.data);
		} catch (error) {
			console.log(error);
		}
	}

	async function handleLikeRepository(id) {
		try {
			const response = await api.post(`repositories/${id}/like`);
			const likedRepository = response.data;
			const updatedRepositories = repositories.map((item) => {
				if (item.id === id) {
					return likedRepository;
				} else {
					return item;
				}
			});

			setRepositories(updatedRepositories);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		listRepositories();
	}, []);

	return (
		<>
			<StatusBar barStyle="light-content " backgroundColor="#7159c1" />
			<SafeAreaView style={styles.container}>
				<FlatList
					style={styles.repositoryContainer}
					data={repositories}
					keyExtractor={(repo) => repo.id}
					renderItem={({ item: repository }) => (
						<View key={repository.id}>
							<Text style={styles.repository}>{repository.title}</Text>

							<View style={styles.techsContainer}>
								{repository &&
									repository.techs.length > 0 &&
									repository.techs.map((tech) => (
										<Text key={tech} style={styles.tech}>
											{tech}
										</Text>
									))}
							</View>

							<View style={styles.likesContainer}>
								<Text
									style={styles.likeText}
									testID={`repository-likes-${repository.id}`}
								>
									{repository.likes}{' '}
									{Number(repository.likes) === 1 ? 'curtida' : 'curtidas'}
								</Text>
							</View>

							<TouchableOpacity
								style={styles.button}
								onPress={() => handleLikeRepository(repository.id)}
								testID={`like-button-${repository.id}`}
							>
								<Text style={styles.buttonText}>Curtir</Text>
							</TouchableOpacity>
						</View>
					)}
				/>
			</SafeAreaView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#7159c1',
	},
	repositoryContainer: {
		marginBottom: 15,
		marginHorizontal: 15,
		backgroundColor: '#fff',
		padding: 20,
	},
	repository: {
		fontSize: 32,
		fontWeight: 'bold',
	},
	techsContainer: {
		flexDirection: 'row',
		marginTop: 10,
	},
	tech: {
		fontSize: 12,
		fontWeight: 'bold',
		marginRight: 10,
		backgroundColor: '#04d361',
		paddingHorizontal: 10,
		paddingVertical: 5,
		color: '#fff',
	},
	likesContainer: {
		marginTop: 15,
		flexDirection: 'row',
	},
	likeText: {
		fontSize: 14,
		fontWeight: 'bold',
		marginRight: 10,
	},
	button: {
		marginTop: 10,
		marginBottom: 12,
	},
	buttonText: {
		fontSize: 14,
		fontWeight: 'bold',
		color: '#fff',
		backgroundColor: '#7159c1',
		padding: 15,
		textAlign: 'center',
	},
});
